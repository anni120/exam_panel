// =====================
// SUPABASE CONNECTION
// =====================

const SUPABASE_URL =
"https://rgewogdiikkantmjnkbq.supabase.co";

const SUPABASE_KEY =
"sb_publishable_JZ77GPeTJ9Y7oaEKsopmhQ_maeh34sp";

const client = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// =====================
// REGISTER
// =====================

async function registerStudent() {

    let name = document.getElementById("regName").value.trim();

    let email = document.getElementById("regEmail").value.trim();

    let password = document.getElementById("regPassword").value.trim();


    if (!name || !email || !password) {

        alert("All Fields Required");

        return;

    }


    const { error } = await client

        .from("students")

        .insert([

            {

                name,

                email,

                password

            }

        ]);


    if (error) {

        alert(error.message);

        return;

    }


    alert("Registration Successful");

    showLogin();

}


// =====================
// LOGIN
// =====================

async function loginStudent() {


    let email =

        document.getElementById("loginEmail").value;


    let password =

        document.getElementById("loginPassword").value;


    const {

        data,

        error

    }

        =

        await client

            .from("students")

            .select("*")

            .eq("email", email)

            .eq("password", password)

            .single();



    if (!data) {

        alert("Invalid Login");

        return;

    }



    if (data.attempted) {

        alert("You Already Attempted This Test");

        return;

    }


    localStorage.setItem(

        "studentId",

        data.id

    );



    document.getElementById(

        "loginBox"

    ).style.display = "none";


    document.getElementById(

        "examBox"

    ).style.display = "block";


    startExam();

}



// =====================
// START EXAM
// =====================

function startExam() {

    document.documentElement.requestFullscreen();

    loadQuestions();
    startTimer();

}



// =====================
// LOAD QUESTIONS
// =====================

async function loadQuestions() {


    const {

        data,

        error

    }

        =

        await client

            .from("questions")

            .select("*")

            .order("question_no");



    let html = "";


    data.forEach(q => {


        html += `

        <div class="question">

        <h3>

        Q${q.question_no}

        (${q.marks} Marks)

        </h3>


        <p>

        ${q.question}

        </p>


        <textarea

        id="q${q.id}"

        rows="6"

        placeholder="Write your answer here">

        </textarea>

        </div>

        `;


    });


    document.getElementById(

        "questions"

    ).innerHTML = html;


}



// =====================
// SUBMIT TEST
// =====================

async function submitTest() {


    let studentId =

        localStorage.getItem(

            "studentId"

        );



    const {

        data

    }

        =

        await client

            .from("questions")

            .select("*");



    for (let q of data) {


        let ans =

            document.getElementById(

                `q${q.id}`

            ).value;



        await client

            .from("answers")

            .insert([

                {

                    student_id: studentId,

                    question_id: q.id,

                    answer: ans

                }

            ]);



    }



    await client

        .from("students")

        .update({

            attempted: true

        })

        .eq(

            "id",

            studentId

        );



    alert(

        "Test Submitted Successfully"

    );


    localStorage.removeItem(

        "studentId"

    );


    location.reload();


}



// =====================
// REGISTER/LOGIN TOGGLE
// =====================

function showLogin() {

    document.getElementById(

        "registerBox"

    ).style.display = "none";


    document.getElementById(

        "loginBox"

    ).style.display = "block";

}



function showRegister() {

    document.getElementById(

        "registerBox"

    ).style.display = "block";


    document.getElementById(

        "loginBox"

    ).style.display = "none";

}



// =====================
// SECURITY
// =====================


// COPY

document.addEventListener(

    "copy",

    e => {

        e.preventDefault();

        alert(

            "Copy Not Allowed"

        );

    }

);


// PASTE

document.addEventListener(

    "paste",

    e => {

        e.preventDefault();

        alert(

            "Paste Not Allowed"

        );

    }

);


// CUT

document.addEventListener(

    "cut",

    e => {

        e.preventDefault();

    }

);


// RIGHT CLICK

document.addEventListener(

    "contextmenu",

    e => {

        e.preventDefault();

    }

);


// KEYBOARD SHORTCUTS

document.addEventListener(

    "keydown",

    e => {


        if (e.ctrlKey && e.key === "c")

            e.preventDefault();


        if (e.ctrlKey && e.key === "v")

            e.preventDefault();


        if (e.ctrlKey && e.key === "x")

            e.preventDefault();


        if (e.ctrlKey && e.key === "u")

            e.preventDefault();


        if (e.key === "F12")

            e.preventDefault();


    }

);



// =====================
// WINDOW SWITCH
// =====================

let warning = 0;


document.addEventListener(

    "visibilitychange",

    () => {


        if (document.hidden) {


            warning++;


            alert(

                "Warning "

                + warning

                +

                ": Window Switch Detected"

            );



            if (warning >= 3) {


                submitTest();

            }


        }


    }

);



// =====================
// FULLSCREEN FORCE
// =====================

document.addEventListener(

    "fullscreenchange",

    () => {


        if (!document.fullscreenElement) {


            alert(

                "Fullscreen Required"

            );


            document.documentElement

                .requestFullscreen();


        }


    }

);


// ===== 90 Minutes Timer =====

let totalTime = 90 * 60; // 90 minute = 5400 seconds

function startTimer() {

const timer = setInterval(() => {

let minutes = Math.floor(totalTime / 60);

let seconds = totalTime % 60;

document.getElementById("timer").innerHTML =
minutes + ":" + (seconds < 10 ? "0" : "") + seconds;


totalTime--;


if(totalTime < 0){

clearInterval(timer);

alert("Time Over!");

submitTest();

}

},1000);

}


if(!localStorage.getItem("endTime")){

let end = Date.now() + 90*60*1000;

localStorage.setItem("endTime",end);

}