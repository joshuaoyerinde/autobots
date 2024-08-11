// async function auto_me(){
//     console.log("i just start")
//     try {
       
//         for (let i = 0; i < 5; i++) {
//             // const user = await fetchUniqueData('https://jsonplaceholder.typicode.com/users');
//             const response = await axios.get('https://jsonplaceholder.typicode.com/users');
//             const mm = response.data
//             mm.forEach(async(user) => {
//                 console.log(user.name)
//                 const [result] = await db.promise().execute(
//                     'INSERT INTO autobots (name, email) VALUES (?, ?)',
//                     [user.name, user.email]
//                 );
//                 const autbotId = result.insertId;
//                 for (let j = 0; j < 10; j++) {
//                     const res = await axios.get('https://jsonplaceholder.typicode.com/posts');
//                     const post =res.data
//                     //post data
//                     post.forEach(async(p)=>{
//                         const [postResult] = await db.promise().execute(
//                             'INSERT INTO posts (autbot_id, title, body) VALUES (?, ?, ?)',
//                             [autbotId, p.title, p.body]
//                         );
//                         const postId = postResult.insertId;
//                         //comment
//                         for (let k = 0; k < 10; k++) {
//                             const resp = await axios.get('https://jsonplaceholder.typicode.com/comments');
//                             const comment = resp.data
//                             comment.forEach(async(c) => {
//                                 await db.promise().execute(
//                                     'INSERT INTO comments (post_id, name, email, body) VALUES (?, ?, ?, ?)',
//                                     [postId, c.name, c.email, c.body]
//                                 );
//                             });
//                         }
//                     })
    
//                 }
//             });
           
//             // const autbotId = result?.insertId;

//         }
//     } catch (err) {
//         console.error('Error creating Autobots:', err.message);
//     }
// }