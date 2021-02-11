const fn_query = require("../middlewares/query")

let fn_addRelation = async(ctx, next) => {
    let startor = ctx.request.body.startor;
    let receptor = ctx.request.body.receptor;
    let relationType = ctx.request.body.relationType;
    let startX = ctx.request.body.startX;
    let startY = ctx.request.body.startY;
    let width = ctx.request.body.width;
    let height = ctx.request.body.height;
    let figId = ctx.request.body.figId;
    let bbox = startX.toString() + ',' + startY + ',' + height + ',' + width;
    let relationId = await fn_query(
        `SELECT MAX(relation_id)+1 as id\
        FROM Relation;`
    );
    let insert = await fn_query(
        `INSERT INTO Relation\
        (relation_id, activator, receptor, fig_id, relation_Bbox, relation_type)\
        VALUE\
        (${relationId[0].id}, ${startor}, ${receptor}, ${figId}, '${bbox}', '${relationType}');`
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
'POST /addRelation': fn_addRelation
};