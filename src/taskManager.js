import React from 'react';

export default class TaskManager extends React.Component {
	constructor(){
		super();
		this.state = {
			editing: false,
			note: {}
		}
		this.save = this.save.bind(this);
	}
	save(e) {
		e.preventDefault();
		const userId = firebase.auth().currentUser.uid;
		const dbRef = firebase.database().ref(`users/${userId}/notes/${this.props.note.key}`);
		dbRef.update({
			title: this.noteTitle.value,
			text: this.noteText.value
		});
		this.setState({
			editing: false
		});
	}
	render(){
		let openEdit = (
			<span>
				<h4>{this.props.note.title}</h4>
				<p>{this.props.note.text}</p>
			</span>
		)
		if(this.state.editing) {
			openEdit = (
				<form onSubmit={this.save}>
					<div>
						<input type="text" defaultValue={this.props.note.title} name='title' ref={ref => this.noteTitle = ref}/>
					</div>
					<div>
						<input type="text" defaultValue={this.props.note.text} name='text' ref={ref => this.noteText = ref}/>
					</div>
					<input type="submit" value="Save Task"/>
				</form>
			)
		}
		return (
			<div className="noteCard">
				<i className="fa fa-edit" onClick={() => this.setState({editing: true})}></i>
				<i className="fa fa-times" onClick={() => this.props.removeTask(this.props.note.key)}></i>
				{openEdit}
			</div>
		)
	}
};