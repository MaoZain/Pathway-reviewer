const fn_query = require("../middlewares/query")

let fn_editElement = async(ctx, next) => {
    let geneId = ctx.request.body.geneId, newName = ctx.request.body.newName, figId = ctx.request.body.figId;
    let dictId = await fn_query(
        `SELECT dict_id\
        FROM Gene_Dictionary\
        WHERE gene_name = '${newName}' OR alias like '${newName},%' OR alias like '%,${newName},%' OR alias like '%,${newName}' ;`
    );
    if (dictId.length == 0) {
        console.log(4546)
        let add_uncertain_name = await fn_query(
            `UPDATE Gene\
            SET uncertain_gene_name = '${newName}',is_match = 3\
            WHERE gene_id = ${geneId};
            `
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
    }else{
        let update = await fn_query(
            `UPDATE Gene\
            SET dict_id = ${dictId[0].dict_id},
            is_match = 1,
            matched_alias = '${newName}'\
            WHERE gene_id = ${geneId};`
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
}

module.exports ={
    'POST /editElement': fn_editElement
  };