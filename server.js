//Including the Modules
var express=require('express');
var path=require("path");

var app=express();

var fs=require('fs');


app.get('/',function(req,res)
{
  res.send("Hello");
});

app.use(express.static(path.join(__dirname,"public")));

// app.get('/index.html',function(request,response)
// {
//   console.log("In Index");
//   var content=fs.readFileSync('public/input.json');
//   response.json(content.toString());
// });


//Creating a new movie list
app.post('/add',function(request,response)
{
  console.log("in addM");
  var reqData="";
  var content=JSON.parse(fs.readFileSync('public/input.json'));
     request.on('data', function (data) {
       reqData+=data;
     });
     request.on('end', function (data) {

       var obj={};

       //Parsing the URL
       reqArr=reqData.split('&');

       obj.Title=reqArr[0].split('=')[1].replace(/\+/g,' ').replace(/%2C/g,",");
       obj.Year=reqArr[1].split('=')[1].replace(/\+/g,' ').replace(/%2C/g,",");
       obj.Actors=reqArr[2].split('=')[1].replace(/\+/g,' ').replace(/%2C/g,",");
       obj.Director=reqArr[3].split('=')[1].replace(/\+/g,' ').replace(/%2C/g,",");
       obj.Released=reqArr[4].split('=')[1].replace(/\+/g,' ').replace(/%2C/g,",");
       obj.Plot=reqArr[5].split('=')[1].replace(/\+/g,' ').replace(/%2C/g,",");
       obj.imdbRating=reqArr[6].split('=')[1].replace(/\+/g,' ').replace(/%2C/g,",");
       obj.Awards=reqArr[7].split('=')[1].replace(/\+/g,' ').replace(/%26/g,"&");
       obj.Poster="images/" + reqArr[8].split('=')[1];

       //Pushing the object to content Array
       content.push(obj);

       fs.writeFile('public/input.json', JSON.stringify(content), function(err) {
        if(err) {
        console.log(err);
        }
      });
    });

      response.sendFile(path.join(__dirname,'public/index.html'));

});

//Reading the JSON File
app.get('/getJSON',function(req,res)
{
  console.log("inside get json");
  var content=fs.readFileSync('public/input.json');
  res.json(content.toString());
});

//Updating the Movie Details
app.post('/update',function(request,response)
{
  console.log("in update");
  var reqData="";
  var content=JSON.parse(fs.readFileSync('public/input.json'));

     request.on('data', function (data) {
       reqData+=data;
     });


     request.on('end', function (data) {
      // console.log('POSTed: ' + reqData);
       reqArr=reqData.split('&');
       for(var k=0;k<content.length;k++)
       {
         if(reqArr[0].split('=')[1].replace(/\+/g,' ').replace(/%2C/g,",") == content[k].Title)
         {
           content[k].Plot=reqArr[1].split('=')[1].replace(/\+/g,' ').replace(/%2C/g,",");
           content[k].imdbRating=reqArr[2].split('=')[1].replace(/\+/g,' ').replace(/%2C/g,",");
           content[k].Awards=reqArr[3].split('=')[1].replace(/\+/g,' ').replace(/%26/g,"&").replace(/%2F/g,'/');
           content[k].Poster="images/" + reqArr[4].split('=')[1];

         }
       }

       fs.writeFile('public/input.json', JSON.stringify(content), function(err) {
        if(err) {
        console.log(err);
        }
      });

      });

      response.sendFile(path.join(__dirname,'public/index.html'));

});


//Deleting the Movie details
app.post('/deletePage',function(request,response)
{
  console.log("in delete");
  var reqData="";
  var content=JSON.parse(fs.readFileSync('public/input.json'));

     request.on('data', function (data) {
       reqData+=data;
     });

     console.log(reqData);
     request.on('end', function (data) {

       reqArr=reqData.split('&');
       for(var k=0;k<content.length;k++)
       {
         if(reqArr[0].split('=')[1].replace(/\+/g,' ').replace(/%2C/g,",") == content[k].Title)
         {
           content[k]="";

         }
       }

       //content.push(obj);

       //console.log(content);

       fs.writeFile('public/input.json', JSON.stringify(content), function(err) {
        if(err) {
        console.log(err);
        }
      });

      });

      //getStaticFileContent(response, 'public/index.html','text/html');
      response.sendFile(path.join(__dirname,'public/index.html'));


});





// app.delete('/api/products/:id', function (req, res){
//   return ProductModel.findById(req.params.id, function (err, product) {
//     return product.remove(function (err) {
//       if (!err) {
//         console.log("removed");
//         return res.send('');
//       } else {
//         console.log(err);
//       }
//     });
//   });
// });
//
app.listen(8080,function()
{
  console.log("Server listening at 8080");
});
