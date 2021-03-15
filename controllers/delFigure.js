const fn_query = require("../middlewares/query")

let fn_delFigure = async(ctx, next) => {
    let figId = ctx.request.body.figId;
    console.log(figId)
    let del = await fn_query(
        `DELETE FROM Figure\
        WHERE fig_id = ${figId};`
    );
    ctx.response.body = del;
}

module.exports ={
    'POST /delFigure': fn_delFigure
};