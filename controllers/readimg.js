const fs = require( 'fs' );

let fn_readImg = async(ctx, next) => {
    let dataset = ctx.request.body.dataset;
    let name  = ctx.request.body.name;
    let path = "static/imgs/" + dataset + "/" + name;
    function readImg(path) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, 'base64', function (err, file) {
                if (err) {
                    console.log(err);
                    return;
                } else {
                    resolve(file)
                }
            });
        });
    }
    let img = await readImg(path);
    ctx.response.body = await img;
}
module.exports = {
	'POST /readImg': fn_readImg
};

