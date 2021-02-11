const fn_query = require("../middlewares/query")

let fn_switchRelation = async(ctx, next) => {
    let relationId = ctx.request.body.relationId;
    let figId = ctx.request.body.figId;
    let update = await fn_query(
        `UPDATE Relation a, Relation b\
        SET a.activator = b.receptor, a.receptor = b.activator\
        WHERE a.relation_id = b.relation_id and a.relation_id = ${relationId};`
    )
    let relation = await fn_query(
        `SELECT activator, receptor, relation_BBox, relation_type, relation_id\
        FROM Relation\
        WHERE fig_id = ${figId};`
        )
    ctx.response.body = relation;
}

module.exports ={
    'POST /switchRelation': fn_switchRelation
  };