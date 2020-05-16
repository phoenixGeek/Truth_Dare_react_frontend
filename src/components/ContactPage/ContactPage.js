import React from "react";
import './ContactPage.scss'
import axios from "axios";
import CollapsibleItem from "../CollapsibleItem";

class ContactPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            'text_value': '',
            'with_response_messages': [],
            'no_response_messages': []
        };

        this.onSend = this.onSend.bind(this);
        this.getMessages = this.getMessages.bind(this);
    }

    componentDidMount() {
        this.getMessages();
    }

    onSend() {
        if (this.state.text_value.length === 0) {
            return;
        }

        let params = new URLSearchParams();

        params.append('message', this.state.text_value);

        axios.put(
            'http://localhost:80/user/contact',
            params,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }
        ).then(() => {
            this.setState({ 'text_value': '' });
            this.getMessages();
        }).catch((error) => {
            if ('response' in error) {
                console.log(error.response);
            } else {
                console.log(error);
            }
        });
    }

    getMessages() {
        if (localStorage.getItem('token') === null) {
            return;
        }

        axios.get(
            'http://localhost:80/user/contact',
            {
                'headers': {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }
        ).then((result) => {

            this.setState({
                'no_response_messages': result.data.no_response_messages,
                'with_response_messages': result.data.with_response_messages
            });

            this.forceUpdate();
        }).catch((error) => {
            if ('response' in error) {
                console.log(error.response);
            } else {
                console.log(error);
            }
        })
    }

    render() {
        return (
            <div className={'ContactPage'}>
                {
                    localStorage.getItem('token') !== null ?
                        <span>
                            <h1>Message us</h1>
                            <form onSubmit={this.onSend}>
                                <textarea className={'TextBox'} value={this.state.text_value} autoFocus={true}
                                    maxLength={'1024'} placeholder={'Type here...'}
                                    onChange={(event) => {
                                        this.setState({ 'text_value': event.target.value });
                                    }} />
                                <br />
                                <input className={'SendButton'} type={'submit'} value={'Submit'} />
                            </form>
                            <br />
                            <br />
                            {
                                this.state.with_response_messages.length > 0 ?
                                    <span>
                                        <h1>replied messages:</h1>
                                        {
                                            this.state.with_response_messages.map((message, index) => {
                                                return <CollapsibleItem key={index} header={message.Message}
                                                    response={message.Response}
                                                    admin_name={message.Username} />
                                            })
                                        }
                                    </span> :
                                    <span />
                            }
                            {
                                this.state.no_response_messages.length > 0 ?
                                    <span>
                                        <h1>Not yet answered messages:</h1>
                                        {
                                            this.state.no_response_messages.map((message) => {
                                                return <CollapsibleItem header={message.Message}
                                                    content={message.Message} />
                                            })
                                        }
                                    </span> :
                                    <span />
                            }
                        </span> :
                        <h1>You must be logged in to send messages.</h1>
                }
            </div>
        );
    }
}


export default ContactPage;