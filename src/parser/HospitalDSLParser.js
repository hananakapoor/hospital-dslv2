// Generated from HospitalDSL.g4 by ANTLR 4.13.1
// jshint ignore: start
import antlr4 from 'antlr4';
import HospitalDSLListener from './HospitalDSLListener.js';
import HospitalDSLVisitor from './HospitalDSLVisitor.js';

const serializedATN = [4,1,32,185,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,
4,2,5,7,5,2,6,7,6,2,7,7,7,2,8,7,8,2,9,7,9,2,10,7,10,2,11,7,11,2,12,7,12,
2,13,7,13,2,14,7,14,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,1,1,1,5,1,41,8,1,10,
1,12,1,44,9,1,1,2,1,2,1,2,1,2,1,2,1,2,1,3,5,3,53,8,3,10,3,12,3,56,9,3,1,
4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,3,4,68,8,4,1,5,1,5,1,5,4,5,73,8,5,
11,5,12,5,74,1,5,1,5,1,6,1,6,1,6,1,6,5,6,83,8,6,10,6,12,6,86,9,6,1,6,1,6,
1,7,1,7,1,8,1,8,1,8,1,8,1,8,1,8,1,8,1,8,1,8,1,8,1,8,1,8,1,8,1,8,1,8,5,8,
107,8,8,10,8,12,8,110,9,8,3,8,112,8,8,1,9,1,9,1,9,1,9,1,9,1,9,1,10,4,10,
121,8,10,11,10,12,10,122,1,11,1,11,1,11,1,11,5,11,129,8,11,10,11,12,11,132,
9,11,1,11,1,11,1,11,1,11,1,11,5,11,139,8,11,10,11,12,11,142,9,11,1,11,1,
11,1,11,1,11,1,11,5,11,149,8,11,10,11,12,11,152,9,11,1,11,3,11,155,8,11,
1,12,1,12,1,12,1,12,1,12,1,13,4,13,163,8,13,11,13,12,13,164,1,14,1,14,1,
14,1,14,1,14,1,14,1,14,1,14,1,14,1,14,5,14,177,8,14,10,14,12,14,180,9,14,
1,14,3,14,183,8,14,1,14,0,0,15,0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,0,
0,196,0,30,1,0,0,0,2,42,1,0,0,0,4,45,1,0,0,0,6,54,1,0,0,0,8,67,1,0,0,0,10,
69,1,0,0,0,12,78,1,0,0,0,14,89,1,0,0,0,16,111,1,0,0,0,18,113,1,0,0,0,20,
120,1,0,0,0,22,154,1,0,0,0,24,156,1,0,0,0,26,162,1,0,0,0,28,182,1,0,0,0,
30,31,5,1,0,0,31,32,5,28,0,0,32,33,5,2,0,0,33,34,3,2,1,0,34,35,5,3,0,0,35,
36,5,0,0,1,36,1,1,0,0,0,37,41,3,4,2,0,38,41,3,18,9,0,39,41,3,24,12,0,40,
37,1,0,0,0,40,38,1,0,0,0,40,39,1,0,0,0,41,44,1,0,0,0,42,40,1,0,0,0,42,43,
1,0,0,0,43,3,1,0,0,0,44,42,1,0,0,0,45,46,5,4,0,0,46,47,5,28,0,0,47,48,5,
2,0,0,48,49,3,6,3,0,49,50,5,3,0,0,50,5,1,0,0,0,51,53,3,8,4,0,52,51,1,0,0,
0,53,56,1,0,0,0,54,52,1,0,0,0,54,55,1,0,0,0,55,7,1,0,0,0,56,54,1,0,0,0,57,
58,5,5,0,0,58,59,5,30,0,0,59,68,5,6,0,0,60,61,5,7,0,0,61,62,5,30,0,0,62,
68,5,6,0,0,63,64,5,8,0,0,64,65,5,28,0,0,65,68,5,6,0,0,66,68,3,10,5,0,67,
57,1,0,0,0,67,60,1,0,0,0,67,63,1,0,0,0,67,66,1,0,0,0,68,9,1,0,0,0,69,70,
5,9,0,0,70,72,5,2,0,0,71,73,3,12,6,0,72,71,1,0,0,0,73,74,1,0,0,0,74,72,1,
0,0,0,74,75,1,0,0,0,75,76,1,0,0,0,76,77,5,3,0,0,77,11,1,0,0,0,78,79,5,28,
0,0,79,80,5,10,0,0,80,84,3,14,7,0,81,83,3,16,8,0,82,81,1,0,0,0,83,86,1,0,
0,0,84,82,1,0,0,0,84,85,1,0,0,0,85,87,1,0,0,0,86,84,1,0,0,0,87,88,5,6,0,
0,88,13,1,0,0,0,89,90,5,28,0,0,90,15,1,0,0,0,91,112,5,11,0,0,92,112,5,12,
0,0,93,112,5,13,0,0,94,95,5,14,0,0,95,112,5,30,0,0,96,97,5,15,0,0,97,112,
5,30,0,0,98,99,5,16,0,0,99,112,5,29,0,0,100,101,5,17,0,0,101,112,5,29,0,
0,102,103,5,18,0,0,103,108,5,30,0,0,104,105,5,19,0,0,105,107,5,30,0,0,106,
104,1,0,0,0,107,110,1,0,0,0,108,106,1,0,0,0,108,109,1,0,0,0,109,112,1,0,
0,0,110,108,1,0,0,0,111,91,1,0,0,0,111,92,1,0,0,0,111,93,1,0,0,0,111,94,
1,0,0,0,111,96,1,0,0,0,111,98,1,0,0,0,111,100,1,0,0,0,111,102,1,0,0,0,112,
17,1,0,0,0,113,114,5,20,0,0,114,115,5,28,0,0,115,116,5,2,0,0,116,117,3,20,
10,0,117,118,5,3,0,0,118,19,1,0,0,0,119,121,3,22,11,0,120,119,1,0,0,0,121,
122,1,0,0,0,122,120,1,0,0,0,122,123,1,0,0,0,123,21,1,0,0,0,124,125,5,21,
0,0,125,130,5,28,0,0,126,127,5,19,0,0,127,129,5,28,0,0,128,126,1,0,0,0,129,
132,1,0,0,0,130,128,1,0,0,0,130,131,1,0,0,0,131,133,1,0,0,0,132,130,1,0,
0,0,133,155,5,6,0,0,134,135,5,22,0,0,135,140,5,28,0,0,136,137,5,19,0,0,137,
139,5,28,0,0,138,136,1,0,0,0,139,142,1,0,0,0,140,138,1,0,0,0,140,141,1,0,
0,0,141,143,1,0,0,0,142,140,1,0,0,0,143,155,5,6,0,0,144,145,5,23,0,0,145,
150,5,28,0,0,146,147,5,19,0,0,147,149,5,28,0,0,148,146,1,0,0,0,149,152,1,
0,0,0,150,148,1,0,0,0,150,151,1,0,0,0,151,153,1,0,0,0,152,150,1,0,0,0,153,
155,5,6,0,0,154,124,1,0,0,0,154,134,1,0,0,0,154,144,1,0,0,0,155,23,1,0,0,
0,156,157,5,24,0,0,157,158,5,2,0,0,158,159,3,26,13,0,159,160,5,3,0,0,160,
25,1,0,0,0,161,163,3,28,14,0,162,161,1,0,0,0,163,164,1,0,0,0,164,162,1,0,
0,0,164,165,1,0,0,0,165,27,1,0,0,0,166,167,5,25,0,0,167,168,5,28,0,0,168,
183,5,6,0,0,169,170,5,26,0,0,170,171,5,30,0,0,171,183,5,6,0,0,172,173,5,
27,0,0,173,178,5,28,0,0,174,175,5,19,0,0,175,177,5,28,0,0,176,174,1,0,0,
0,177,180,1,0,0,0,178,176,1,0,0,0,178,179,1,0,0,0,179,181,1,0,0,0,180,178,
1,0,0,0,181,183,5,6,0,0,182,166,1,0,0,0,182,169,1,0,0,0,182,172,1,0,0,0,
183,29,1,0,0,0,16,40,42,54,67,74,84,108,111,122,130,140,150,154,164,178,
182];


const atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

const decisionsToDFA = atn.decisionToState.map( (ds, index) => new antlr4.dfa.DFA(ds, index) );

const sharedContextCache = new antlr4.atn.PredictionContextCache();

export default class HospitalDSLParser extends antlr4.Parser {

    static grammarFileName = "HospitalDSL.g4";
    static literalNames = [ null, "'Hospital'", "'{'", "'}'", "'Module'", 
                            "'Label:'", "';'", "'Icon:'", "'Color:'", "'Fields'", 
                            "':'", "'required'", "'optional'", "'unique'", 
                            "'label'", "'default'", "'min'", "'max'", "'options'", 
                            "','", "'Role'", "'Portal:'", "'Manage:'", "'Dashboard:'", 
                            "'Auth'", "'Type:'", "'Expiry:'", "'Roles:'" ];
    static symbolicNames = [ null, null, null, null, null, null, null, null, 
                             null, null, null, null, null, null, null, null, 
                             null, null, null, null, null, null, null, null, 
                             null, null, null, null, "ID", "INT", "STRING", 
                             "WS", "COMMENT" ];
    static ruleNames = [ "hospital", "hospitalBody", "moduleDecl", "moduleBody", 
                         "moduleItem", "fieldsDecl", "fieldDef", "fieldType", 
                         "fieldConstraint", "roleDecl", "roleBody", "roleFeature", 
                         "authDecl", "authBody", "authItem" ];

    constructor(input) {
        super(input);
        this._interp = new antlr4.atn.ParserATNSimulator(this, atn, decisionsToDFA, sharedContextCache);
        this.ruleNames = HospitalDSLParser.ruleNames;
        this.literalNames = HospitalDSLParser.literalNames;
        this.symbolicNames = HospitalDSLParser.symbolicNames;
    }



	hospital() {
	    let localctx = new HospitalContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 0, HospitalDSLParser.RULE_hospital);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 30;
	        this.match(HospitalDSLParser.T__0);
	        this.state = 31;
	        this.match(HospitalDSLParser.ID);
	        this.state = 32;
	        this.match(HospitalDSLParser.T__1);
	        this.state = 33;
	        this.hospitalBody();
	        this.state = 34;
	        this.match(HospitalDSLParser.T__2);
	        this.state = 35;
	        this.match(HospitalDSLParser.EOF);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	hospitalBody() {
	    let localctx = new HospitalBodyContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 2, HospitalDSLParser.RULE_hospitalBody);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 42;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        while((((_la) & ~0x1f) === 0 && ((1 << _la) & 17825808) !== 0)) {
	            this.state = 40;
	            this._errHandler.sync(this);
	            switch(this._input.LA(1)) {
	            case 4:
	                this.state = 37;
	                this.moduleDecl();
	                break;
	            case 20:
	                this.state = 38;
	                this.roleDecl();
	                break;
	            case 24:
	                this.state = 39;
	                this.authDecl();
	                break;
	            default:
	                throw new antlr4.error.NoViableAltException(this);
	            }
	            this.state = 44;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	moduleDecl() {
	    let localctx = new ModuleDeclContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 4, HospitalDSLParser.RULE_moduleDecl);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 45;
	        this.match(HospitalDSLParser.T__3);
	        this.state = 46;
	        this.match(HospitalDSLParser.ID);
	        this.state = 47;
	        this.match(HospitalDSLParser.T__1);
	        this.state = 48;
	        this.moduleBody();
	        this.state = 49;
	        this.match(HospitalDSLParser.T__2);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	moduleBody() {
	    let localctx = new ModuleBodyContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 6, HospitalDSLParser.RULE_moduleBody);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 54;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        while((((_la) & ~0x1f) === 0 && ((1 << _la) & 928) !== 0)) {
	            this.state = 51;
	            this.moduleItem();
	            this.state = 56;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	moduleItem() {
	    let localctx = new ModuleItemContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 8, HospitalDSLParser.RULE_moduleItem);
	    try {
	        this.state = 67;
	        this._errHandler.sync(this);
	        switch(this._input.LA(1)) {
	        case 5:
	            this.enterOuterAlt(localctx, 1);
	            this.state = 57;
	            this.match(HospitalDSLParser.T__4);
	            this.state = 58;
	            this.match(HospitalDSLParser.STRING);
	            this.state = 59;
	            this.match(HospitalDSLParser.T__5);
	            break;
	        case 7:
	            this.enterOuterAlt(localctx, 2);
	            this.state = 60;
	            this.match(HospitalDSLParser.T__6);
	            this.state = 61;
	            this.match(HospitalDSLParser.STRING);
	            this.state = 62;
	            this.match(HospitalDSLParser.T__5);
	            break;
	        case 8:
	            this.enterOuterAlt(localctx, 3);
	            this.state = 63;
	            this.match(HospitalDSLParser.T__7);
	            this.state = 64;
	            this.match(HospitalDSLParser.ID);
	            this.state = 65;
	            this.match(HospitalDSLParser.T__5);
	            break;
	        case 9:
	            this.enterOuterAlt(localctx, 4);
	            this.state = 66;
	            this.fieldsDecl();
	            break;
	        default:
	            throw new antlr4.error.NoViableAltException(this);
	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	fieldsDecl() {
	    let localctx = new FieldsDeclContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 10, HospitalDSLParser.RULE_fieldsDecl);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 69;
	        this.match(HospitalDSLParser.T__8);
	        this.state = 70;
	        this.match(HospitalDSLParser.T__1);
	        this.state = 72; 
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        do {
	            this.state = 71;
	            this.fieldDef();
	            this.state = 74; 
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	        } while(_la===28);
	        this.state = 76;
	        this.match(HospitalDSLParser.T__2);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	fieldDef() {
	    let localctx = new FieldDefContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 12, HospitalDSLParser.RULE_fieldDef);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 78;
	        this.match(HospitalDSLParser.ID);
	        this.state = 79;
	        this.match(HospitalDSLParser.T__9);
	        this.state = 80;
	        this.fieldType();
	        this.state = 84;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        while((((_la) & ~0x1f) === 0 && ((1 << _la) & 522240) !== 0)) {
	            this.state = 81;
	            this.fieldConstraint();
	            this.state = 86;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	        }
	        this.state = 87;
	        this.match(HospitalDSLParser.T__5);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	fieldType() {
	    let localctx = new FieldTypeContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 14, HospitalDSLParser.RULE_fieldType);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 89;
	        this.match(HospitalDSLParser.ID);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	fieldConstraint() {
	    let localctx = new FieldConstraintContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 16, HospitalDSLParser.RULE_fieldConstraint);
	    var _la = 0;
	    try {
	        this.state = 111;
	        this._errHandler.sync(this);
	        switch(this._input.LA(1)) {
	        case 11:
	            this.enterOuterAlt(localctx, 1);
	            this.state = 91;
	            this.match(HospitalDSLParser.T__10);
	            break;
	        case 12:
	            this.enterOuterAlt(localctx, 2);
	            this.state = 92;
	            this.match(HospitalDSLParser.T__11);
	            break;
	        case 13:
	            this.enterOuterAlt(localctx, 3);
	            this.state = 93;
	            this.match(HospitalDSLParser.T__12);
	            break;
	        case 14:
	            this.enterOuterAlt(localctx, 4);
	            this.state = 94;
	            this.match(HospitalDSLParser.T__13);
	            this.state = 95;
	            this.match(HospitalDSLParser.STRING);
	            break;
	        case 15:
	            this.enterOuterAlt(localctx, 5);
	            this.state = 96;
	            this.match(HospitalDSLParser.T__14);
	            this.state = 97;
	            this.match(HospitalDSLParser.STRING);
	            break;
	        case 16:
	            this.enterOuterAlt(localctx, 6);
	            this.state = 98;
	            this.match(HospitalDSLParser.T__15);
	            this.state = 99;
	            this.match(HospitalDSLParser.INT);
	            break;
	        case 17:
	            this.enterOuterAlt(localctx, 7);
	            this.state = 100;
	            this.match(HospitalDSLParser.T__16);
	            this.state = 101;
	            this.match(HospitalDSLParser.INT);
	            break;
	        case 18:
	            this.enterOuterAlt(localctx, 8);
	            this.state = 102;
	            this.match(HospitalDSLParser.T__17);
	            this.state = 103;
	            this.match(HospitalDSLParser.STRING);
	            this.state = 108;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            while(_la===19) {
	                this.state = 104;
	                this.match(HospitalDSLParser.T__18);
	                this.state = 105;
	                this.match(HospitalDSLParser.STRING);
	                this.state = 110;
	                this._errHandler.sync(this);
	                _la = this._input.LA(1);
	            }
	            break;
	        default:
	            throw new antlr4.error.NoViableAltException(this);
	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	roleDecl() {
	    let localctx = new RoleDeclContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 18, HospitalDSLParser.RULE_roleDecl);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 113;
	        this.match(HospitalDSLParser.T__19);
	        this.state = 114;
	        this.match(HospitalDSLParser.ID);
	        this.state = 115;
	        this.match(HospitalDSLParser.T__1);
	        this.state = 116;
	        this.roleBody();
	        this.state = 117;
	        this.match(HospitalDSLParser.T__2);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	roleBody() {
	    let localctx = new RoleBodyContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 20, HospitalDSLParser.RULE_roleBody);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 120; 
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        do {
	            this.state = 119;
	            this.roleFeature();
	            this.state = 122; 
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	        } while((((_la) & ~0x1f) === 0 && ((1 << _la) & 14680064) !== 0));
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	roleFeature() {
	    let localctx = new RoleFeatureContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 22, HospitalDSLParser.RULE_roleFeature);
	    var _la = 0;
	    try {
	        this.state = 154;
	        this._errHandler.sync(this);
	        switch(this._input.LA(1)) {
	        case 21:
	            this.enterOuterAlt(localctx, 1);
	            this.state = 124;
	            this.match(HospitalDSLParser.T__20);
	            this.state = 125;
	            this.match(HospitalDSLParser.ID);
	            this.state = 130;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            while(_la===19) {
	                this.state = 126;
	                this.match(HospitalDSLParser.T__18);
	                this.state = 127;
	                this.match(HospitalDSLParser.ID);
	                this.state = 132;
	                this._errHandler.sync(this);
	                _la = this._input.LA(1);
	            }
	            this.state = 133;
	            this.match(HospitalDSLParser.T__5);
	            break;
	        case 22:
	            this.enterOuterAlt(localctx, 2);
	            this.state = 134;
	            this.match(HospitalDSLParser.T__21);
	            this.state = 135;
	            this.match(HospitalDSLParser.ID);
	            this.state = 140;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            while(_la===19) {
	                this.state = 136;
	                this.match(HospitalDSLParser.T__18);
	                this.state = 137;
	                this.match(HospitalDSLParser.ID);
	                this.state = 142;
	                this._errHandler.sync(this);
	                _la = this._input.LA(1);
	            }
	            this.state = 143;
	            this.match(HospitalDSLParser.T__5);
	            break;
	        case 23:
	            this.enterOuterAlt(localctx, 3);
	            this.state = 144;
	            this.match(HospitalDSLParser.T__22);
	            this.state = 145;
	            this.match(HospitalDSLParser.ID);
	            this.state = 150;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            while(_la===19) {
	                this.state = 146;
	                this.match(HospitalDSLParser.T__18);
	                this.state = 147;
	                this.match(HospitalDSLParser.ID);
	                this.state = 152;
	                this._errHandler.sync(this);
	                _la = this._input.LA(1);
	            }
	            this.state = 153;
	            this.match(HospitalDSLParser.T__5);
	            break;
	        default:
	            throw new antlr4.error.NoViableAltException(this);
	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	authDecl() {
	    let localctx = new AuthDeclContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 24, HospitalDSLParser.RULE_authDecl);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 156;
	        this.match(HospitalDSLParser.T__23);
	        this.state = 157;
	        this.match(HospitalDSLParser.T__1);
	        this.state = 158;
	        this.authBody();
	        this.state = 159;
	        this.match(HospitalDSLParser.T__2);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	authBody() {
	    let localctx = new AuthBodyContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 26, HospitalDSLParser.RULE_authBody);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 162; 
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        do {
	            this.state = 161;
	            this.authItem();
	            this.state = 164; 
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	        } while((((_la) & ~0x1f) === 0 && ((1 << _la) & 234881024) !== 0));
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	authItem() {
	    let localctx = new AuthItemContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 28, HospitalDSLParser.RULE_authItem);
	    var _la = 0;
	    try {
	        this.state = 182;
	        this._errHandler.sync(this);
	        switch(this._input.LA(1)) {
	        case 25:
	            this.enterOuterAlt(localctx, 1);
	            this.state = 166;
	            this.match(HospitalDSLParser.T__24);
	            this.state = 167;
	            this.match(HospitalDSLParser.ID);
	            this.state = 168;
	            this.match(HospitalDSLParser.T__5);
	            break;
	        case 26:
	            this.enterOuterAlt(localctx, 2);
	            this.state = 169;
	            this.match(HospitalDSLParser.T__25);
	            this.state = 170;
	            this.match(HospitalDSLParser.STRING);
	            this.state = 171;
	            this.match(HospitalDSLParser.T__5);
	            break;
	        case 27:
	            this.enterOuterAlt(localctx, 3);
	            this.state = 172;
	            this.match(HospitalDSLParser.T__26);
	            this.state = 173;
	            this.match(HospitalDSLParser.ID);
	            this.state = 178;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            while(_la===19) {
	                this.state = 174;
	                this.match(HospitalDSLParser.T__18);
	                this.state = 175;
	                this.match(HospitalDSLParser.ID);
	                this.state = 180;
	                this._errHandler.sync(this);
	                _la = this._input.LA(1);
	            }
	            this.state = 181;
	            this.match(HospitalDSLParser.T__5);
	            break;
	        default:
	            throw new antlr4.error.NoViableAltException(this);
	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}


}

HospitalDSLParser.EOF = antlr4.Token.EOF;
HospitalDSLParser.T__0 = 1;
HospitalDSLParser.T__1 = 2;
HospitalDSLParser.T__2 = 3;
HospitalDSLParser.T__3 = 4;
HospitalDSLParser.T__4 = 5;
HospitalDSLParser.T__5 = 6;
HospitalDSLParser.T__6 = 7;
HospitalDSLParser.T__7 = 8;
HospitalDSLParser.T__8 = 9;
HospitalDSLParser.T__9 = 10;
HospitalDSLParser.T__10 = 11;
HospitalDSLParser.T__11 = 12;
HospitalDSLParser.T__12 = 13;
HospitalDSLParser.T__13 = 14;
HospitalDSLParser.T__14 = 15;
HospitalDSLParser.T__15 = 16;
HospitalDSLParser.T__16 = 17;
HospitalDSLParser.T__17 = 18;
HospitalDSLParser.T__18 = 19;
HospitalDSLParser.T__19 = 20;
HospitalDSLParser.T__20 = 21;
HospitalDSLParser.T__21 = 22;
HospitalDSLParser.T__22 = 23;
HospitalDSLParser.T__23 = 24;
HospitalDSLParser.T__24 = 25;
HospitalDSLParser.T__25 = 26;
HospitalDSLParser.T__26 = 27;
HospitalDSLParser.ID = 28;
HospitalDSLParser.INT = 29;
HospitalDSLParser.STRING = 30;
HospitalDSLParser.WS = 31;
HospitalDSLParser.COMMENT = 32;

HospitalDSLParser.RULE_hospital = 0;
HospitalDSLParser.RULE_hospitalBody = 1;
HospitalDSLParser.RULE_moduleDecl = 2;
HospitalDSLParser.RULE_moduleBody = 3;
HospitalDSLParser.RULE_moduleItem = 4;
HospitalDSLParser.RULE_fieldsDecl = 5;
HospitalDSLParser.RULE_fieldDef = 6;
HospitalDSLParser.RULE_fieldType = 7;
HospitalDSLParser.RULE_fieldConstraint = 8;
HospitalDSLParser.RULE_roleDecl = 9;
HospitalDSLParser.RULE_roleBody = 10;
HospitalDSLParser.RULE_roleFeature = 11;
HospitalDSLParser.RULE_authDecl = 12;
HospitalDSLParser.RULE_authBody = 13;
HospitalDSLParser.RULE_authItem = 14;

class HospitalContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = HospitalDSLParser.RULE_hospital;
    }

	ID() {
	    return this.getToken(HospitalDSLParser.ID, 0);
	};

	hospitalBody() {
	    return this.getTypedRuleContext(HospitalBodyContext,0);
	};

	EOF() {
	    return this.getToken(HospitalDSLParser.EOF, 0);
	};

	enterRule(listener) {
	    if(listener instanceof HospitalDSLListener ) {
	        listener.enterHospital(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof HospitalDSLListener ) {
	        listener.exitHospital(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof HospitalDSLVisitor ) {
	        return visitor.visitHospital(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class HospitalBodyContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = HospitalDSLParser.RULE_hospitalBody;
    }

	moduleDecl = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(ModuleDeclContext);
	    } else {
	        return this.getTypedRuleContext(ModuleDeclContext,i);
	    }
	};

	roleDecl = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(RoleDeclContext);
	    } else {
	        return this.getTypedRuleContext(RoleDeclContext,i);
	    }
	};

	authDecl = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(AuthDeclContext);
	    } else {
	        return this.getTypedRuleContext(AuthDeclContext,i);
	    }
	};

	enterRule(listener) {
	    if(listener instanceof HospitalDSLListener ) {
	        listener.enterHospitalBody(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof HospitalDSLListener ) {
	        listener.exitHospitalBody(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof HospitalDSLVisitor ) {
	        return visitor.visitHospitalBody(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class ModuleDeclContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = HospitalDSLParser.RULE_moduleDecl;
    }

	ID() {
	    return this.getToken(HospitalDSLParser.ID, 0);
	};

	moduleBody() {
	    return this.getTypedRuleContext(ModuleBodyContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof HospitalDSLListener ) {
	        listener.enterModuleDecl(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof HospitalDSLListener ) {
	        listener.exitModuleDecl(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof HospitalDSLVisitor ) {
	        return visitor.visitModuleDecl(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class ModuleBodyContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = HospitalDSLParser.RULE_moduleBody;
    }

	moduleItem = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(ModuleItemContext);
	    } else {
	        return this.getTypedRuleContext(ModuleItemContext,i);
	    }
	};

	enterRule(listener) {
	    if(listener instanceof HospitalDSLListener ) {
	        listener.enterModuleBody(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof HospitalDSLListener ) {
	        listener.exitModuleBody(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof HospitalDSLVisitor ) {
	        return visitor.visitModuleBody(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class ModuleItemContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = HospitalDSLParser.RULE_moduleItem;
    }

	STRING() {
	    return this.getToken(HospitalDSLParser.STRING, 0);
	};

	ID() {
	    return this.getToken(HospitalDSLParser.ID, 0);
	};

	fieldsDecl() {
	    return this.getTypedRuleContext(FieldsDeclContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof HospitalDSLListener ) {
	        listener.enterModuleItem(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof HospitalDSLListener ) {
	        listener.exitModuleItem(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof HospitalDSLVisitor ) {
	        return visitor.visitModuleItem(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class FieldsDeclContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = HospitalDSLParser.RULE_fieldsDecl;
    }

	fieldDef = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(FieldDefContext);
	    } else {
	        return this.getTypedRuleContext(FieldDefContext,i);
	    }
	};

	enterRule(listener) {
	    if(listener instanceof HospitalDSLListener ) {
	        listener.enterFieldsDecl(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof HospitalDSLListener ) {
	        listener.exitFieldsDecl(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof HospitalDSLVisitor ) {
	        return visitor.visitFieldsDecl(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class FieldDefContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = HospitalDSLParser.RULE_fieldDef;
    }

	ID() {
	    return this.getToken(HospitalDSLParser.ID, 0);
	};

	fieldType() {
	    return this.getTypedRuleContext(FieldTypeContext,0);
	};

	fieldConstraint = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(FieldConstraintContext);
	    } else {
	        return this.getTypedRuleContext(FieldConstraintContext,i);
	    }
	};

	enterRule(listener) {
	    if(listener instanceof HospitalDSLListener ) {
	        listener.enterFieldDef(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof HospitalDSLListener ) {
	        listener.exitFieldDef(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof HospitalDSLVisitor ) {
	        return visitor.visitFieldDef(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class FieldTypeContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = HospitalDSLParser.RULE_fieldType;
    }

	ID() {
	    return this.getToken(HospitalDSLParser.ID, 0);
	};

	enterRule(listener) {
	    if(listener instanceof HospitalDSLListener ) {
	        listener.enterFieldType(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof HospitalDSLListener ) {
	        listener.exitFieldType(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof HospitalDSLVisitor ) {
	        return visitor.visitFieldType(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class FieldConstraintContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = HospitalDSLParser.RULE_fieldConstraint;
    }

	STRING = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(HospitalDSLParser.STRING);
	    } else {
	        return this.getToken(HospitalDSLParser.STRING, i);
	    }
	};


	INT() {
	    return this.getToken(HospitalDSLParser.INT, 0);
	};

	enterRule(listener) {
	    if(listener instanceof HospitalDSLListener ) {
	        listener.enterFieldConstraint(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof HospitalDSLListener ) {
	        listener.exitFieldConstraint(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof HospitalDSLVisitor ) {
	        return visitor.visitFieldConstraint(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class RoleDeclContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = HospitalDSLParser.RULE_roleDecl;
    }

	ID() {
	    return this.getToken(HospitalDSLParser.ID, 0);
	};

	roleBody() {
	    return this.getTypedRuleContext(RoleBodyContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof HospitalDSLListener ) {
	        listener.enterRoleDecl(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof HospitalDSLListener ) {
	        listener.exitRoleDecl(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof HospitalDSLVisitor ) {
	        return visitor.visitRoleDecl(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class RoleBodyContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = HospitalDSLParser.RULE_roleBody;
    }

	roleFeature = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(RoleFeatureContext);
	    } else {
	        return this.getTypedRuleContext(RoleFeatureContext,i);
	    }
	};

	enterRule(listener) {
	    if(listener instanceof HospitalDSLListener ) {
	        listener.enterRoleBody(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof HospitalDSLListener ) {
	        listener.exitRoleBody(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof HospitalDSLVisitor ) {
	        return visitor.visitRoleBody(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class RoleFeatureContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = HospitalDSLParser.RULE_roleFeature;
    }

	ID = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(HospitalDSLParser.ID);
	    } else {
	        return this.getToken(HospitalDSLParser.ID, i);
	    }
	};


	enterRule(listener) {
	    if(listener instanceof HospitalDSLListener ) {
	        listener.enterRoleFeature(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof HospitalDSLListener ) {
	        listener.exitRoleFeature(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof HospitalDSLVisitor ) {
	        return visitor.visitRoleFeature(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class AuthDeclContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = HospitalDSLParser.RULE_authDecl;
    }

	authBody() {
	    return this.getTypedRuleContext(AuthBodyContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof HospitalDSLListener ) {
	        listener.enterAuthDecl(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof HospitalDSLListener ) {
	        listener.exitAuthDecl(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof HospitalDSLVisitor ) {
	        return visitor.visitAuthDecl(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class AuthBodyContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = HospitalDSLParser.RULE_authBody;
    }

	authItem = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(AuthItemContext);
	    } else {
	        return this.getTypedRuleContext(AuthItemContext,i);
	    }
	};

	enterRule(listener) {
	    if(listener instanceof HospitalDSLListener ) {
	        listener.enterAuthBody(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof HospitalDSLListener ) {
	        listener.exitAuthBody(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof HospitalDSLVisitor ) {
	        return visitor.visitAuthBody(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class AuthItemContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = HospitalDSLParser.RULE_authItem;
    }

	ID = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(HospitalDSLParser.ID);
	    } else {
	        return this.getToken(HospitalDSLParser.ID, i);
	    }
	};


	STRING() {
	    return this.getToken(HospitalDSLParser.STRING, 0);
	};

	enterRule(listener) {
	    if(listener instanceof HospitalDSLListener ) {
	        listener.enterAuthItem(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof HospitalDSLListener ) {
	        listener.exitAuthItem(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof HospitalDSLVisitor ) {
	        return visitor.visitAuthItem(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}




HospitalDSLParser.HospitalContext = HospitalContext; 
HospitalDSLParser.HospitalBodyContext = HospitalBodyContext; 
HospitalDSLParser.ModuleDeclContext = ModuleDeclContext; 
HospitalDSLParser.ModuleBodyContext = ModuleBodyContext; 
HospitalDSLParser.ModuleItemContext = ModuleItemContext; 
HospitalDSLParser.FieldsDeclContext = FieldsDeclContext; 
HospitalDSLParser.FieldDefContext = FieldDefContext; 
HospitalDSLParser.FieldTypeContext = FieldTypeContext; 
HospitalDSLParser.FieldConstraintContext = FieldConstraintContext; 
HospitalDSLParser.RoleDeclContext = RoleDeclContext; 
HospitalDSLParser.RoleBodyContext = RoleBodyContext; 
HospitalDSLParser.RoleFeatureContext = RoleFeatureContext; 
HospitalDSLParser.AuthDeclContext = AuthDeclContext; 
HospitalDSLParser.AuthBodyContext = AuthBodyContext; 
HospitalDSLParser.AuthItemContext = AuthItemContext; 
