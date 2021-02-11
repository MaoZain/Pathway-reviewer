const fn_query = require("../middlewares/query")

let fn_deleteElement = async(ctx, next) => {
    let geneId = ctx.request.body.geneId;
    let figId = ctx.request.body.figId;
    //delete element 
    let deleteElement = await fn_query(
        `DELETE FROM Gene\
        WHERE gene_id = ${geneId};`
    )
    let deleteRelation = await fn_query(
        `DELETE FROM Relation\
        WHERE activator = ${geneId} OR receptor = ${geneId};`
    )
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
    'POST /deleteElement': fn_deleteElement
  };