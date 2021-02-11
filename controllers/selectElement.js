const fn_query = require("../middlewares/query")

//edit geneName whose is_match is 2
let fn_selectElement = async(ctx, next) => {
    let geneId = ctx.request.body.geneId;
    let newName = ctx.request.body.newName;
    let dictId = ctx.request.body.dictId;
    let figId = ctx.request.body.figId;
    let update = await fn_query(
        `UPDATE Gene\
        SET is_match = 1,
        dict_id = ${dictId},
        matched_alias = '${newName}'\
        WHERE gene_id = ${geneId};`
    );
    let element = await fn_query(
        `SELECT *\
        FROM Gene\
        WHERE fig_id = ${figId};`
      );
    let relation = await fn_query(
        `SELECT a.activator, a.receptor, a.relation_BBox, a.relation_type, a.relation_id\
        FROM Relation a\
        JOIN Figure b\
        ON a.fig_id = b.fig_id\
        WHERE a.fig_id = ${figId};`
    )
    let result = [element, relation];
    ctx.response.body = result;
}


module.exports ={
    'POST /selectElement': fn_selectElement
};
