var express = require('express'),
    webpack = require('webpack'),
    path = require('path'),
    config = require('./webpack.dev.config'),
    ExtractTextPlugin = require('extract-text-webpack-plugin');

config.vue = {
    loader: {
        css: ExtractTextPlugin.extract('css'),
        stylus: ExtractTextPlugin.extract('css!stylus')
    }
};

var app = express();
var compiler = webpack(config);

// handle fallback for HTML5 history API
//app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(require('webpack-dev-middleware')(compiler, {
    publicPath: config.output.publicPath,
    stats: {
        colors: true,
        chunks: false
    }
}));

// enable hot-reload and state-preserving
var hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: console.log
});

compiler.plugin('compilation', function(compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
        hotMiddleware.publish({ action: 'reload' });
        cb();
    });
});

app.use(hotMiddleware);
// app.use('/font-awesome', express.static(path.resolve(__dirname, '../bower_components/components-font-awesome')));
// app.use('/media', express.static(path.resolve(__dirname, '../app/media')));
app.use('/material', express.static(path.resolve(__dirname, '../bower_components/material-design-lite')));

var port = 9090;
app.listen(port, '0.0.0.0', function (err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log('Listening at http://localhost:' + port);
});
