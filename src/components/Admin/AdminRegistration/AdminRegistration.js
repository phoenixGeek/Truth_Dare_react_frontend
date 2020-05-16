import React from "react";
import axios from "axios";
import './AdminRegistration.scss'

class AdminRegistration extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            'register_username': '',
            'register_password': '',
            'register_message': '',
            'register_type': 0,
            addFlag: false
        };

        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.handleAddAccount = this.handleAddAccount.bind(this);
    }

    onFormSubmit() {
        console.log("here submit form--->", this.state)
        // return;

        if (this.state.register_username.length === 0 ||
            this.state.register_password.length === 0 ||
            this.state.register_type === 0)
            this.setState({ 'register_message': '' });

        const params = new URLSearchParams();

        params.append('username', this.state.register_username);
        params.append('password', this.state.register_password);
        params.append('type', this.state.register_type);

        const options = {
            'headers': {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }

        axios.post(
            'http://localhost:80/admin/register',
            params,
            options
        ).then(() => {
            this.setState({
                'register_username': '',
                'register_password': '',
                'register_message': '',
                'register_type': 0
            });

            this.forceUpdate();
        }).catch((error) => {
            if (error.response !== undefined) {
                this.setState({ 'register_message': error.response.data.error });
            } else {
                console.log(error);
            }
        })
    }

    handleAddAccount() {

        this.setState({
            addFlag: !this.state.addFlag,
        })
    }
    render() {
        return (
            <div className={'AddAdmin'}>
                <a className="addAccount" onClick={this.handleAddAccount}>User management</a>
                <br />
                <br />
                {this.state.addFlag ?
                    <form className={'AddAdminForm'} onSubmit={this.onFormSubmit}>
                        <input type={'text'} size={'32'} maxLength={'32'} placeholder={'Username'}
                            pattern={'.{4,}'} value={this.state.register_username} onChange={(event) => {
                                this.setState({ 'register_username': event.target.value });
                            }} />
                        <br />
                        <input type={'password'} size={'32'} maxLength={'32'} placeholder={'Password'}
                            pattern={'.{8,}'} value={this.state.register_password} onChange={(event) => {
                                this.setState({ 'register_password': event.target.value });
                            }} />
                        <br />
                        <label>
                            <input type={'radio'} name={'type'} value={this.state.register_type} onClick={() => {
                                this.setState({ 'register_type': 1 });
                            }} />
                     Administrator
                     <br />
                        </label>
                        <label>
                            <input type={'radio'} name={'type'} onClick={() => {
                                this.setState({ 'register_type': 2 });
                            }} required />
                     Tech Support
                     <br />
                        </label>
                        <p className={'Message'}>{this.state.register_message}</p>
                        <input className={'Submit'} type={'submit'} value={'Register'} />
                        <br />
                        <br />
                    </form> : ''
                }

            </div>
        )
    }
}

export default AdminRegistration;