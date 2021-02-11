const fn_query = require("../middlewares/query")

let fn_confirmEdit = async(ctx, next) => {
    let figId = ctx.request.body.figId;
    let confirm = await fn_query(
        `UPDATE Figure\
        SET review_status = 1\
        WHERE fig_id = ${figId};`
    )
}

module.exports ={
    'POST /confirmEdit': fn_confirmEdit
};