const baseurl = "https://tarmeezAcademy.com/api/v1/";

function setupUI() {
  const token = localStorage.getItem("token");
  const loggeddiv = document.getElementById("logged-div");
  const Logoutdiv = document.getElementById("Logout-div");
  const createPostButton = document.getElementById("add-button");
  const addcommentdiv=document.getElementById("add-comment-div");
  if (token == null) {
    if (createPostButton != null) {
      createPostButton.style.setProperty("display", "none", "important");
    }
    Logoutdiv.style.setProperty("display", "none", "important");
    loggeddiv.style.setProperty("display", "flex", "important");
  } else {
    //for loggen in user
    if (createPostButton != null) {
      createPostButton.style.setProperty("display", "block", "important");
    }

    loggeddiv.style.setProperty("display", "none", "important");
    Logoutdiv.style.setProperty("display", "flex", "important");
    const user = getCurrentUser();
    document.getElementById("nav-userName").innerHTML = user.username;
    document.getElementById("nav-user-image").src = user.profile_image;
  }
}

// function which get all posts
function loginBtnClick() {
  let username = document.getElementById("username-input").value;
  let password = document.getElementById("password-input").value;
  const params = {
    username: username,
    password: password,
  };
  const url = `${baseurl}login`;
  toggleLoader(true);
  axios.post(url, params).then((response) => {
  toggleLoader(false);

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    //to hidden the modal after click
    const modal = document.getElementById("LoginModal");
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
    showAlert("logged in successfully", "success");
    setupUI();
  }).catch((e) => {
      const message = e.response.data.message;
      showAlert(message, "danger");
  }).finally(() => {
    toggleLoader(false);
    })
}
document.getElementById("login-btn").addEventListener("click", loginBtnClick);
//End of login button click

//fucntino for register modal
function registerButtonCLicked() {
  let username = document.getElementById("register-username-input").value;
  let password = document.getElementById("register-password-input").value;
  let name = document.getElementById("register-name-input").value;
  let image = document.getElementById("register-image-input").files[0];

  let formData = new FormData();
  formData.append("name", name);
  formData.append("username", username);
  formData.append("password", password);
  formData.append("image", image);

  const url = `${baseurl}register`;
  const headers = {
    "Content-Type": "multipart/form-data", //to convert it from json to formData
  };
  toggleLoader(true);
  axios
    .post(url, formData, {
      headers: headers,
    })
    .then((response) => {
    toggleLoader(false);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      const modal = document.getElementById("register-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showAlert("New User Registred successfully", "success");
      setupUI();
    })
    .catch((e) => {
      const message = e.response.data.message;
      showAlert(message, "danger");
    }).finally(() => {
    toggleLoader(false);
      
    })
}
document
  .getElementById("register-btn")
  .addEventListener("click", registerButtonCLicked);

//for logout
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  showAlert("logout Succsufully", "success");
  setupUI();
}
document.getElementById("Logout-btn").addEventListener("click", logout);
//fucntion for show alert
function showAlert(customMessage, type) {
  const alertPlaceholder = document.getElementById("succesAlert");
  
  const appendAlert = (message, type) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");

    alertPlaceholder.append(wrapper);
  };
  appendAlert(customMessage, type);
  alertPlaceholder.classList.add('show');
    alertPlaceholder.classList.remove('fade');
    setTimeout(function() {
      alertPlaceholder.style.display = 'block';
    }, 150); // Wait for the fade out transition to complete
  //to hide the alert
  setTimeout(closeAlert, 3000);
}
//fucntion for get the current user
function getCurrentUser() {
  let user = null;
  const storageuser = localStorage.getItem("user");
  if (storageuser) {
    user = JSON.parse(storageuser);
  }
  return user;
}
//These funcion for Edit and delete button for each post
 function DeletePostButton(postObject){

        //we do thay since htmlTages Dosen`t pass the objects 
        let post=JSON.parse(decodeURIComponent(postObject));
       document.getElementById("delete-post-id-input").value=post.id;
        //this will make a modal with js only
        let postModal=new bootstrap.Modal(document.getElementById("DeletePostModal"),{});
        postModal.toggle();
     
        
        
    }
    function ConfirmPostDelete(){
        //this id come from fucntion deletepostbutton
        const postId= document.getElementById("delete-post-id-input").value;
        const token=localStorage.getItem("token");
        const url = `${baseurl}posts/${postId}`;
       const headers = {
            "Content-Type": "multipart/form-data", //to convert it from json to formData
            "authorization": `Bearer ${token}`,
        };

      toggleLoader(true);
        axios.delete(url,{
            headers:headers
        }).then((response) => {
          toggleLoader(false);
          //to hidden the modal after click
          const modal = document.getElementById("DeletePostModal");
          const modalInstance = bootstrap.Modal.getInstance(modal);
          modalInstance.hide();
          showAlert("New post have been Deleted", "success");
          getPostsforSpecifcUser();
      
        
  }) .catch((e) => {
        const message = e.response.data.message;
        showAlert(message, "danger");
    });
    }
    // to make the fields compatable with createBtn 
     function addBtnclicked(){
        document.getElementById("post-modal-submit-btn").innerHTML="Create";
        document.getElementById("post-id-input").value="";
        document.getElementById("post-title-input").value="";
        document.getElementById("post-body-input").value="";
        //this will make a modal with js only
        document.getElementById("post-modal-title").innerHTML="Create Post";
        let postModal=new bootstrap.Modal(document.getElementById("CreatePostModal"),{});
        postModal.toggle();
        
}
      function EditPostButton(postObject){

        //we do thay since htmlTages Dosen`t pass the objects 
        let post=JSON.parse(decodeURIComponent(postObject));
        //TO check which fucntion we will use create post or edit post
        document.getElementById("post-modal-submit-btn").innerHTML="Update";
        document.getElementById("post-id-input").value=post.id;
        document.getElementById("post-title-input").value=post.title;
        document.getElementById("post-body-input").value=post.body;
        //this will make a modal with js only
        document.getElementById("post-modal-title").innerHTML="Edit Post";
        let postModal=new bootstrap.Modal(document.getElementById("CreatePostModal"),{});
        postModal.toggle();
      }
//These funcion for Edit and delete button for each post
      //for create New Post
      function createNewpost() {
        let postId=document.getElementById("post-id-input").value;
        let iscreate=postId==null||postId=="";
        
        let title = document.getElementById("post-title-input").value;
        let postBody = document.getElementById("post-body-input").value;
        let image = document.getElementById("post-image-input").files[0];
        //we do form data to give oppurtiny to send image
        let formData = new FormData();
        formData.append("body", postBody);
        formData.append("title", title);
        formData.append("image", image);
        
        
        let url = `${baseurl}posts`;
        const token = localStorage.getItem("token");
        const headers = {
          "Content-Type": "multipart/form-data", //to convert it from json to formData
          "authorization": `Bearer ${token}`,
        };
        if(iscreate){
          url = `${baseurl}posts`;
          toggleLoader(true);
          
          axios
            .post(url, formData, {
              headers: headers,
            })
            .then((response) => {
              toggleLoader(false);
  
              const modal = document.getElementById("CreatePostModal");
              const modalInstance = bootstrap.Modal.getInstance(modal);
              modalInstance.hide();
              showAlert("New Post Created", "success");
              getPosts();
            })
            .catch((e) => {
              const message = e.response.data.message;
              showAlert(message, "danger");
            }).finally(() => {
            toggleLoader(false);
              
            })
          }
          //Second Case you want to edit
          else{
            formData.append("_method","put");
            url=`${baseurl}posts/${postId}`;
            toggleLoader(true);
            
            axios.post(url, formData, {
              headers: headers,
            })
              .then((response) => {
              toggleLoader(false);
              
              const modal = document.getElementById("CreatePostModal");
              const modalInstance = bootstrap.Modal.getInstance(modal);
              modalInstance.hide();
              showAlert("Update Post", "success");
              getPosts();
            }).catch((e) => {
              const message = e.response.data.message;
              showAlert(message, "danger");
            }).finally(() => {
            toggleLoader(false);
              
            })
          }
        }
//for create New Post
function profileCLicked() {
  const user = getCurrentUser();
  if (user) {
    window.location = `profile.html?userid=${user.id}`;     
  } else {
    showAlert("You Should be Registered First", "danger");
  }
    
}
function toggleLoader(show=true) {
  if (show) {
    document.getElementById("loader").style.visibility = 'visible';

  } else {
    document.getElementById("loader").style.visibility = 'hidden';
  }
    
}
// Function to close the alert
function closeAlert() {
  var alert = document.getElementById('succesAlert');
  if (alert) {
    alert.classList.remove('show');
    alert.classList.add('fade');
    setTimeout(function() {
      alert.style.display = 'none';
    }, 150); // Wait for the fade out transition to complete
  }
}



  