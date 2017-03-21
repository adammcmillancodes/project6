import React from 'react';
import ReactDOM from 'react-dom';
import TaskManager from './taskManager';

const config = {
	apiKey: "AIzaSyB6yWa86qI85fNrcsv4MeLCBLfCNRX2bhc",
	authDomain: "project6-4c3c6.firebaseapp.com",
	databaseURL: "https://project6-4c3c6.firebaseio.com",
	storageBucket: "project6-4c3c6.appspot.com",
	messagingSenderId: "194891937100"
};
firebase.initializeApp(config);

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			notes: [],
			loggedin: false
		}
		this.showPopUp = this.showPopUp.bind(this);
		this.addTask = this.addTask.bind(this);
		this.showCreateUser = this.showCreateUser.bind(this);
		this.createUser = this.createUser.bind(this);
		this.showLogin = this.showLogin.bind(this);
		this.loginUser = this.loginUser.bind(this);
		this.logOut = this.logOut.bind(this);
	}
	componentDidMount(){
		firebase.auth().onAuthStateChanged((user) => {
			if(user){
				firebase.database().ref(`users/${user.uid}/notes`).on('value', (res) => {
					let userData = res.val();
					const dataArray = [];
					for(let objKey in userData) {
						userData[objKey].key = objKey;
						dataArray.push(userData[objKey])
					}
					this.setState({
						notes: dataArray,
						loggedin: true
					})
				});
				
			}
			else {
				this.setState({
					notes: [],
					loggedin: false
				});
			}
		})
	}
	showPopUp(e) {
		e.preventDefault();
		this.sidebar.classList.toggle("show");
		}
		addTask(e) {
		e.preventDefault();
		const note = {
			title: this.noteTitle.value,
			text: this.noteText.value
		};
		const userId = firebase.auth().currentUser.uid;
		const dbRef = firebase.database().ref(`users/${userId}/notes`);

		dbRef.push(note);

		this.noteTitle.value = "";
		this.noteText.value = "";
		this.showPopUp(e);
	}
		removeTask(noteId) {
			const userId = firebase.auth().currentUser.uid;
			const dbRef = firebase.database().ref(`users/${userId}/notes/${noteId}`);
			dbRef.remove();
		}
		showCreateUser(e) {
			e.preventDefault();
			this.overlay.classList.toggle('show');
			this.createUserModal.classList.toggle('show');
		}
		createUser(e) {
			e.preventDefault();

			const email = this.createEmail.value;
			const password = this.createPassword.value;
			const confirm = this.confirmPassword.value;
			if (password === confirm) {
				firebase.auth()
				.createUserWithEmailAndPassword(email, password)
				.then((res) => {
					this.showCreateUser(e);
				})
				.catch((err) => {
					alert(err.message)
				})
			}
			else{
				alert("passwords must match");
			}
			
		}
		
		showLogin(e){
			e.preventDefault();
			this.overlay.classList.toggle('show');
			this.loginModal.classList.toggle('show');
		}
		loginUser(e){
			e.preventDefault();
			console.log("log me in!");
			const email = this.userEmail.value;
			const password = this.userPassword.value;

			firebase.auth()
				.signInWithEmailAndPassword(email,password)
				.then((res) => {
					this.showLogin(e);
				})
				.catch((err) => {
					alert(err.message);
				});
		}
		logOut() {
			firebase.auth().signOut();
		}
		renderCards() {
			if (this.state.loggedin) {
				return (
					<div className="taskWrapper">
					{this.state.notes.map((note,i) => {
						return (
							<TaskManager note={note} key={`note-${i}`} removeTask={this.removeTask}/>
						)
					}).reverse()}
				</div>)
			}
			else {
				return (<h2>Sign in to begin!</h2>)
			}
		}

		render(){
			return(
				<div>
					<header className="header">
						<h1>Get Your App Together</h1>
						<nav>
							{
								(() => {
									if(this.state.loggedin) {
										return(
											<span>
												<a href="" onClick={this.showPopUp}>New Watch List</a>
												<a href="" onClick={this.showPopUp}>New Book List</a>
												<a href="" onClick={this.showPopUp}>New Task</a>
												<a href="" onClick={this.logOut}>Log Out</a>
											</span>
										)
									}
									else {
										return(
											<span>
												<a href="" onClick={this.showCreateUser}>Create Account</a>
												<a href="" onClick={this.showLogin}>Login</a>
												<a href="" onClick={this.logOut}>Log Out</a>
											</span>
										)
									}
								})()
							}
						</nav>
					</header>
					<div className="overlay" ref={ref => this.overlay = ref}></div>
					<section className="notes">
						{this.renderCards()}
					</section>
					<aside className="sidebar" ref={ref => this.sidebar = ref}>
						<form onSubmit={this.addTask}>
							<h3>New Task</h3>
							<div className="close-btn" onClick={this.showPopUp}>
								<i className="fa fa-times"></i>
							</div>
							<label htmlFor="note-title">Title</label>
							<input type="text" name="note-title" ref={ref => this.noteTitle = ref }/>
							<label htmlFor="note-text">text</label>
							<textarea name="note-text" ref={ref => this.noteText = ref}></textarea>
							<input type="submit" value="Add New Note"/>
						</form>
					</aside>
					<div className="loginModal modal" ref={ref => this.loginModal = ref}>
						<div className="close" onClick={this.showLogin}>
							<i className="fa fa-times"></i>
						</div>
						<form action="" onSubmit={this.loginUser}>
							<div>
								<label htmlFor="email">Email:</label>
								<input type="text" name="email" ref={ref => this.userEmail = ref}/>
							</div>
							<div>
								<label htmlFor="password">Password:</label>
								<input type="password" name="password" ref={ref => this.userPassword = ref}/>
							</div>
							<div>
								<input type="submit" value="Login"/>
							</div>
						</form>					
					</div>
					<div className="createUserModal modal" ref={ref => this.createUserModal = ref}>
						<div className="close" onClick={this.showCreateUser}>
							<i className="fa fa-times"></i>
						</div>
						<form action="" onSubmit={this.createUser}>
							<div>
								<label htmlFor="createEmail">Email:</label>
								<input type="text" name="createEmail" ref={ref => this.createEmail = ref}/>
							</div>
							<div>
								<label htmlFor="createPassword">Password:</label>
								<input type="password" name="createPassword" ref={ref => this.createPassword = ref}/>
							</div>
							<div>
								<label htmlFor="confirmPassword">Password</label>
								<input type="password" name="confirmPassword" ref={ref => this.confirmPassword = ref}/>
							</div>
							<div>
								<input type="submit" value="Create"/>
							</div>
						</form>
					</div>
				</div>
			)
		}
	}

ReactDOM.render(<App />, document.getElementById('app'));