const fn_query = require("../middlewares/query")

let fn_addElement = async(ctx, next) => {
    let name = ctx.request.body.name;
    let startX = ctx.request.body.startX;
    let startY = ctx.request.body.startY;
    let width = ctx.request.body.width;
    let height = ctx.request.body.height;
    let figId = ctx.request.body.figId;
    let bbox = startX.toString() + ',' + startY + ',' + width + ',' + height;
    let dictId = await fn_query(
        `SELECT dict_id\
        FROM Gene_Dictionary\
        WHERE gene_name = '${name}' OR alias like '${name},%' OR alias like '%,${name},%' OR alias like '%,${name}' ;`
    );
    if (dictId.length == 0) {
        ctx.response.body = 0;
    }else{
        console.log('19',dictId)
        let geneId = await fn_query(
            `SELECT MAX(gene_id)+1 as id\
            FROM Gene`
        );
        let ocrId = await fn_query(
            `SELECT ocr_id\
            FROM Gene\
            WHERE fig_id = ${figId};`
        );
        console.log(ocrId)
        let insert = await fn_query(
            `INSERT INTO Gene\
            (gene_id, fig_id, dict_id, ocr_id,gene_BBox, is_match, matched_alias)\
            VALUE\
            (${geneId[0].id}, ${figId}, ${dictId[0].dict_id}, ${ocrId[0].ocr_id}, '${bbox}', 1, '${name}');`
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
    'POST /addElement': fn_addElement
};