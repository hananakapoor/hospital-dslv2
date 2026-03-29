import antlr4 from 'antlr4';
import HospitalDSLLexer   from '../parser/HospitalDSLLexer.js';
import HospitalDSLParser  from '../parser/HospitalDSLParser.js';
import HospitalDSLVisitor from '../parser/HospitalDSLVisitor.js';

class HospitalTransformer extends HospitalDSLVisitor {

  visitHospital(ctx) {
    const name = ctx.ID().getText();
    const body = this.visitHospitalBody(ctx.hospitalBody());
    return { name, ...body };
  }

  visitHospitalBody(ctx) {
    const result = { modules: [], roles: {}, auth: null };

    for (const m of ctx.moduleDecl() || [])
      result.modules.push(this.visitModuleDecl(m));

    for (const r of ctx.roleDecl() || []) {
      const role = this.visitRoleDecl(r);
      result.roles[role.name] = role;
    }

    if (ctx.authDecl()?.length > 0)
      result.auth = this.visitAuthDecl(ctx.authDecl()[0]);

    return result;
  }

  // ── Module ──────────────────────────────────────────────────

  visitModuleDecl(ctx) {
    const id   = ctx.ID().getText();
    const body = ctx.moduleBody();

    let label  = id;
    let icon   = '📋';
    let color  = 'blue';
    let fields = [];

    for (const item of body.moduleItem() || []) {
      const text = item.getText();
      if (text.startsWith('Label:')) {
        label = item.STRING().getText().replace(/"/g, '');
      } else if (text.startsWith('Icon:')) {
        icon  = item.STRING().getText().replace(/"/g, '');
      } else if (text.startsWith('Color:')) {
        color = item.ID().getText();
      } else if (item.fieldsDecl()) {
        fields = item.fieldsDecl().fieldDef().map(f => this.visitFieldDef(f));
      }
    }

    return { id, label, icon, color, fields };
  }

  visitFieldDef(ctx) {
    const name = ctx.ID().getText();
    const type = ctx.fieldType().ID().getText();
    const constraints = ctx.fieldConstraint() || [];

    const field = {
      name,
      type,
      required: false,
      unique:   false,
      label:    name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1'),
      default:  null,
      min:      null,
      max:      null,
      options:  [],
    };

    for (const c of constraints) {
      const text = c.getText();
      if      (text === 'required') field.required = true;
      else if (text === 'optional') field.required = false;
      else if (text === 'unique')   field.unique   = true;
      else if (text.startsWith('label'))   field.label   = c.STRING()[0].getText().replace(/"/g, '');
      else if (text.startsWith('default')) field.default = c.STRING()[0].getText().replace(/"/g, '');
      else if (text.startsWith('min'))     field.min     = parseInt(c.INT().getText());
      else if (text.startsWith('max'))     field.max     = parseInt(c.INT().getText());
      else if (text.startsWith('options')) field.options = c.STRING().map(s => s.getText().replace(/"/g, ''));
    }

    return field;
  }

  // ── Role ────────────────────────────────────────────────────

  visitRoleDecl(ctx) {
    const name   = ctx.ID().getText();
    const result = { name, portal: [], manage: [], dashboard: [] };

    for (const feature of ctx.roleBody().roleFeature() || []) {
      const text = feature.getText();
      const ids  = feature.ID().map(i => i.getText());
      if      (text.startsWith('Portal:'))    result.portal    = ids;
      else if (text.startsWith('Manage:'))    result.manage    = ids;
      else if (text.startsWith('Dashboard:')) result.dashboard = ids;
    }

    return result;
  }

  // ── Auth ────────────────────────────────────────────────────

  visitAuthDecl(ctx) {
    let type   = 'JWT';
    let expiry = '7d';
    let roles  = [];

    for (const item of ctx.authBody().authItem() || []) {
      const text = item.getText();
      if      (text.startsWith('Type:'))   type   = item.ID()[0].getText();
      else if (text.startsWith('Expiry:')) expiry = item.STRING().getText().replace(/"/g, '');
      else if (text.startsWith('Roles:'))  roles  = item.ID().map(i => i.getText());
    }

    return { type, expiry, roles };
  }
}

export function parseDSL(input) {
  const chars  = new antlr4.InputStream(input);
  const lexer  = new HospitalDSLLexer(chars);
  const tokens = new antlr4.CommonTokenStream(lexer);
  const parser = new HospitalDSLParser(tokens);

  parser.removeErrorListeners();
  parser.addErrorListener({
    syntaxError(recognizer, offendingSymbol, line, column, msg) {
      throw new Error(`Syntax error at line ${line}:${column} — ${msg}`);
    }
  });

  const tree        = parser.hospital();
  const transformer = new HospitalTransformer();
  return transformer.visitHospital(tree);
}
