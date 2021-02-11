const fn_query = require("../middlewares/query")

let fn_review = async(ctx, next) =>{
  let id = ctx.request.body.id;
  let element = await fn_query(
    `SELECT *\
    FROM Gene\
    WHERE fig_id = ${id};`
  );
  if (element.length == 0) {
    ctx.response.body = 0;
  }else{
    let imginfo = await fn_query(
      `SELECT width,height\
      FROM Figure\
      WHERE fig_id = ${id};`
    );
    let relation = await fn_query(
      `SELECT activator, receptor, relation_BBox, relation_type, relation_id\
      FROM Relation\
      WHERE fig_id = ${id};`
    )
    let result = [element, imginfo, relation]
    // console.log(result)
    ctx.response.body = result;
  }
}

module.exports ={
  'POST /review': fn_review
};
