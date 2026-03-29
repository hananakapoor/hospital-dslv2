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
      result.auth = this.visitAuthDecl(ctx.authDecl(0));

    return result;
  }

  // ── Module ──────────────────────────────────────────────────

  visitModuleDecl(ctx) {
    const id    = ctx.ID().getText();
    const body  = ctx.moduleBody();
    const label = body.labelDecl()
      ? body.labelDecl().STRING().getText().replace(/"/g, '') : id;
    const icon  = body.iconDecl()
      ? body.iconDecl().STRING().getText().replace(/"/g, '') : '📋';
    const color = body.colorDecl()
      ? body.colorDecl().ID().getText() : 'blue';
    const fields = body.fieldsDecl().fieldDef().map(f => this.visitFieldDef(f));
    return { id, label, icon, color, fields };
  }

  visitFieldDef(ctx) {
    const name = ctx.ID().getText();
    const type = ctx.fieldType().getText();
    const constraints = ctx.fieldConstraint() || [];
    const field = {
      name, type,
      required: false, unique: false,
      label: name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1'),
      default: null, min: null, max: null, options: [],
    };
    for (const c of constraints) {
      const text = c.getText();
      if (text === 'required')       field.required = true;
      else if (text === 'optional')  field.required = false;
      else if (text === 'unique')    field.unique   = true;
      else if (text.startsWith('label'))   field.label   = c.STRING().getText().replace(/"/g, '');
      else if (text.startsWith('default')) field.default = c.STRING().getText().replace(/"/g, '');
      else if (text.startsWith('min'))     field.min     = parseInt(c.INT().getText());
      else if (text.startsWith('max'))     field.max     = parseInt(c.INT().getText());
      else if (text.startsWith('options')) field.options = c.STRING().map(s => s.getText().replace(/"/g, ''));
    }
    return field;
  }

  // ── Role ────────────────────────────────────────────────────

  visitRoleDecl(ctx) {
    const name = ctx.roleName().getText();
    const body = ctx.roleBody();
    const result = { name, portal: [], manage: [], dashboard: [] };

    for (const f of body.roleFeature()) {
      if (f.portalDecl())    result.portal    = f.portalDecl().ID().map(i => i.getText());
      if (f.manageDecl())    result.manage    = f.manageDecl().ID().map(i => i.getText());
      if (f.dashboardDecl()) result.dashboard = f.dashboardDecl().ID().map(i => i.getText());
    }
    return result;
  }

  // ── Auth ────────────────────────────────────────────────────

  visitAuthDecl(ctx) {
    const body   = ctx.authBody();
    const type   = body.authTypeDecl().ID().getText();
    const expiry = body.authExpiryDecl()
      ? body.authExpiryDecl().STRING().getText().replace(/"/g, '') : '7d';
    const roles  = body.rolesDecl().ID().map(i => i.getText());
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
