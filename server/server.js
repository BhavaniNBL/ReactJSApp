const Hapi = require('hapi');
var mongoose = require('mongoose');


const server = Hapi.server({
    host: 'localhost',
    port: 8100,
});

mongoose.connect('mongodb://test:test123@ds121225.mlab.com:21225/hapi-react-test');

var db = mongoose.connection;
db.on('error', function () {
    console.log('DB connection error');
});
db.once('open', function () {
    console.log("DB opened");
});

var dbSchema = mongoose.Schema({
    name: String,
    email: String
});

var users = mongoose.model('user', dbSchema);

server.route({
    method: 'POST',
    path: '/createUser',
    config: {
        cors: { origin: ['*'] }
    },
    handler: function (request, reply) {
        var newUser = new users({ name: request.payload.name, email: request.payload.email });
        return newUser.save()
            .then(function (response) {

                console.log(response);
                return response;
            })
            .catch(function (error) {
                console.log(error);
                return error;
            });
    }

});

server.route({
    method: 'GET',
    path: '/getUsers',
    config: {
        cors: { origin: ['*'] }
    },
    handler: function (request, reply) {
        return users.find()
            .then(function (response) {
                console.log(response);
                return response;
            })
            .catch(function (error) {
                console.log(error);
            });
    }

});

server.route({
    method: 'DELETE',
    path: '/deleteUsers/{id}',
    config: {
        cors: { origin: ['*'] }
    },
    handler: function (request, reply) {
        return users.findOneAndDelete({ _id: request.params.id }, function (err, response) {
            return response;
        });
    }

});

server.route({
    method: 'PUT',
    path: '/updateUsers/{id}',
    config: {
        cors: { origin: ['*'] }
    },
    handler: function (request, reply) {
        return users.findOneAndUpdate({ _id: request.params.id }, request.payload, function (err, response) {
            return response;
        });
    }
});




async function start() {
    try {
        await server.start();
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
    console.log('Server running at:', server.info.uri);
};

start();