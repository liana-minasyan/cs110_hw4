'use strict';
const fs = require('fs');
const http = require('http');
const url = require('url');
const querystring = require('querystring');

const todos = [
    {id: Math.random() + '' ,message:"Go get some sleep", completed: false},
    {id: Math.random() + '' ,message:"Rock and roll",  completed: false}
];

const server= http.createServer(function(req, res){
	const filePath = './public'+ req.url;
	if (req.url === '/todos' && req.method === "GET"){
		const json = JSON.stringify(todos);
		res.setHeader('Content-Type','application/json')
		res.end(json);
	}
	 	
	 
	fs.readFile(filePath ,function(err,data){
		if(!err) {
			res.statusCode = 200;
		    res.end(data);
		}
	})
	const  method = req.method;
    if(method === 'POST') {
        if(req.url.indexOf('/todos') === 0) {
            let body = '';
            req.on('data', function (chunk) {
                body += chunk;
            });
            req.on('end', function () {
                let jsonObj = JSON.parse(body);  
                jsonObj.id = Math.random() + ''; 
                todos[todos.length] = jsonObj;   

                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify(jsonObj));
            });
            return;
        }
    }

	if(method === 'GET') {
	    if(req.url.indexOf('/todosSearch') === 0) {
	        res.setHeader('Content-Type', 'application/json');
	            return res.end(JSON.stringify(todos));
	            
	    }
	}

	if(method === 'PUT') {
	    if(req.url.indexOf('/todos') === 0) {
			let body = '';
	        req.on('data', function (chunk) {
	            body += chunk;
	        });
	        req.on('end', function () {
	            let jsonObj = JSON.parse(body); // now that we have the content, convert the JSON into an object

	            // find the todo in our todos array and replace it with the new object
	            for(let i = 0; i < todos.length; i++) {
	                if(todos[i].id === jsonObj.id) { // found the same object
	                    todos[i] = jsonObj; // replace the old object with the new object
	                    res.setHeader('Content-Type', 'application/json');
	                    return res.end(JSON.stringify(jsonObj));
	                }
	            }

	            res.statusCode = 404;
	            return res.end('Data was not found and can therefore not be updated');
	        });
	        return;
	    }
	}

	
    if(method === 'DELETE') {
        if(req.url.indexOf('/todos/') >= 0) {
            let id =  req.url.substr(7);
            for(let i = 0; i < todos.length; i++) {
                if(id === todos[i].id) {
                    todos.splice(i, 1);
                    res.statusCode = 200;
                    return res.end('Successfully removed');
                }
            }
        }else{
        	res.statusCode = 404;
            return res.end('Data was not found');
        }
    }
});
server.listen(3001);