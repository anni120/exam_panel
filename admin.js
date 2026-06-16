const SUPABASE_URL =
"https://rgewogdiikkantmjnkbq.supabase.co";

const SUPABASE_KEY =
"sb_publishable_JZ77GPeTJ9Y7oaEKsopmhQ_maeh34sp";

const client =
supabase.createClient(
SUPABASE_URL,
SUPABASE_KEY
);

function adminLogin(){

let email=

document.getElementById("email").value;

let password=

document.getElementById("password").value;


if(

email=="admin@zerotwocode.com"

&&

password=="admin123"

){

document.getElementById(

"loginBox"

).style.display="none";


document.getElementById(

"dashboard"

).style.display="block";

}

else{

alert(

"Invalid Admin"

);

}

}

function showAddQuestion(){

document.getElementById(

"content"

).innerHTML=`

<input id='qno'

placeholder='Question Number'>


<select id='type'>

<option value='theory'>

Theory

</option>

<option value='programming'>

Programming

</option>

</select>


<textarea

id='question'

placeholder='Question'>

</textarea>


<input

id='marks'

placeholder='Marks'>


<button

onclick='saveQuestion()'>

Save Question

</button>

`;

}

async function saveQuestion(){


let qno=

document.getElementById(

"qno"

).value;


let type=

document.getElementById(

"type"

).value;


let question=

document.getElementById(

"question"

).value;


let marks=

document.getElementById(

"marks"

).value;



const {error}=

await client

.from("questions")

.insert([

{

question_no:qno,

question:question,

type:type,

marks:marks

}

]);


if(error){

alert(error.message);

return;

}


alert(

"Question Saved"

);

}


async function viewQuestions(){

const {data}=

await client

.from("questions")

.select("*")

.order("question_no");


let html="";


data.forEach(q=>{


html+=`

<h3>

Q${q.question_no}

</h3>

<p>

${q.question}

</p>

<hr>

`;

});


document.getElementById(

"content"

).innerHTML=html;

}


async function viewStudents(){

const {data}=

await client

.from("students")

.select("*");


let html="<h2>Students</h2>";


data.forEach(s=>{


html+=`

<p>

${s.name}

-

${s.email}

</p>

`;

});


document.getElementById(

"content"

).innerHTML=html;

}


async function viewAnswers(){

const {data}=

await client

.from("answers")

.select("*");


console.log(data);

alert(

"Answers Loaded"

);

}

function logout(){

location.reload();

}