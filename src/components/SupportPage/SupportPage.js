import React from 'react';
import './SupportPage.scss'
import CollapsibleItem from "../CollapsibleItem";
import axios from 'axios';

class SupportPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            'messages': []
        }

        this.onSend = this.onSend.bind(this);
        this.displayMessage = this.displayMessage.bind(this);
        this.onFlagImportant = this.onFlagImportant.bind(this);
        this.onReport = this.onReport.bind(this);
        this.getMessages = this.getMessages.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }

    componentDidMount() {
        this.getMessages();
    }

    getMessages() {

        const options = {
            'headers': {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }

        axios.get(
            'http://localhost:80/support/messages',
            options
        ).then((result) => {

            this.setState({
                'messages': result.data
            });

        }).catch((error) => {
            if (error.response !== undefined) {
                console.log(error.response);
            } else {
                console.log(error);
            }
        });
    }

    onSend(message) {

        if (message.text_value.length === 0) {
            return;
        }

        message.Response = message.text_value;

        let params = new URLSearchParams();

        params.append('response', message.Response);
        params.append('message_id', message.MessageID);

        const options = {
            'headers': {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }

        axios.post(
            'http://localhost:80/support/messages',
            params,
            options
        ).then(() => {
        }).catch((error) => {
            if (error.response !== undefined) {
                console.log(error.response);
            } else {
                console.log(error);
            }
        });
    }

    onFlagImportant(message) {

        if (message.Flagged_important === 1) {
            console.log("this is already marked as important");
            return;
        }
        message.important = message['important'] === undefined || message['important'] === false;

        const params = new URLSearchParams();

        params.append('message_id', message.MessageID);
        params.append('important', message.important ? '1' : '0');

        const options = {
            'headers': {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }

        axios.post(
            'http://localhost:80/support/messages',
            params,
            options
        ).then(() => {
        }).catch((error) => {
            if (error.response !== undefined) {
                console.log(error.response);
            } else {
                console.log(error);
            }
        });
    }

    onReport(message) {
        const params = new URLSearchParams();
        params.append('message_id', message.MessageID);

        const options = {
            'headers': {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }

        axios.post(
            'http://localhost:80/support/messages',
            params,
            options
        ).then(() => {
            this.getMessages()
        }).catch((error) => {
            if (error.response !== undefined) {
                console.log(error.response);
            } else {
                console.log(error);
            }
        });
    }

    onDelete(message) {
        const options = {
            'headers': {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }

        axios.delete(
            `http://localhost:80/support/messages/${message.MessageID}`,
            options
        ).then(() => {
            this.getMessages()
        }).catch((error) => {
            if (error.response !== undefined) {
                console.log(error.response);
            } else {
                console.log(error);
            }
        });
    }

    displayMessage(message, index) {

        message['text_value'] = '';
        return (
            <CollapsibleItem header={message.Message} key={index}
                content={
                    <div className={'MessageContainer'}>
                        <button onClick={() => { this.onReport(message) }}>
                            Strike user
                        </button>
                        <button onClick={() => { this.onDelete(message) }}>
                            Delete
                        </button>
                        {
                            message.Response !== null ?
                                <button onClick={() => { this.onFlagImportant(message) }}>
                                    {
                                        message['Flagged_important'] === undefined ||
                                            message['Flagged_important'] === 0 ?
                                            'Mark important' :
                                            'Marked important'
                                    }
                                </button> :
                                <span />
                        }
                        <hr />
                        {
                            message.Response === null ?
                                <span>
                                    <textarea maxLength={'512'}
                                        placeholder={'Maximum 512 characters.'}
                                        onChange={(event) => {
                                            message.text_value = event.target.value;
                                        }} />
                                    <br />
                                    <button onClick={() => { this.onSend(message); }}>
                                        Send
                                    </button>
                                </span> :
                                <p>{message.Response}</p>
                        }
                    </div>
                }
            />
        );
    }

    render() {

        return (
            <div className={'SupportPage'} >
                {
                    this.state.messages.length === 0 ?
                        <h1>No messages</h1> :
                        <span>
                            <h1>Messages:</h1>
                            {

                                this.state.messages.map(this.displayMessage)
                            }
                        </span>
                }
            </div >
        );
    }
}

export default SupportPage;