const fn_query = require("../middlewares/query")

let fn_deleteRelation = async(ctx, next) => {
    let relationId = ctx.request.body.relationId;
    let figId = ctx.request.body.figId;
    let deleteRelation = fn_query(
        `DELETE FROM Relation\
        WHERE relation_id = ${relationId};`
    );
    let element = await fn_query(
        `SELECT *\
        FROM Gene\
        WHERE fig_id = ${figId};`
      );
    let relation = await fn_query(
      `SELECT activator, receptor, relation_BBox, relation_type, relation_id\
      FROM Relation\
      WHERE fig_id = ${figId};`
    )
    let result = [element, relation];
    ctx.response.body = result;
}

module.exports ={
    'POST /deleteRelation': fn_deleteRelation
  };