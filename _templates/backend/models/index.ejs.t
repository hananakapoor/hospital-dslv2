---
to: generated/backend/models/<%= name %>Model.js
---
const mongoose = require('mongoose');

const <%= name %>Schema = new mongoose.Schema({
<%_ fields.forEach(field => { _%>
  <%= field.name %>: { type: <%= field.type %>, required: <%= field.required %> },
<%_ }); _%>
}, { timestamps: true });

module.exports = mongoose.model('<%= name %>', <%= name %>Schema);