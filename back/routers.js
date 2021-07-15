module.exports = (app) => {
    const testController = require('./controllers/test');
    const game = require('./controllers/game');
    app.get('/test', testController.test);
    app.post('/newGame', game.newGame);
    app.post('/move', game.move);
    app.post('/transformation', game.transformation);
    app.post('/joinGame', game.joinGame);
    app.post('/refreshGame', game.refreshGame);
};