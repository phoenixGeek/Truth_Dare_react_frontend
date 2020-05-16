import React from "react";
import axios from 'axios';
import './Account.scss';
import $ from 'jquery';

class Account extends React.Component {

    constructor(props) {
        super(props);
        this.onLogin = this.onLogin.bind(this);
        this.onRegister = this.onRegister.bind(this);
        this.onLogout = this.onLogout.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleRegister = this.handleRegister.bind(this);

        this.state = {
            'login_message': '',
            'register_message': '',
            'register_email': '',
            'register_username': '',
            'register_password': '',
            'register_first_name': '',
            'register_last_name': '',
            loginView: false,
            registerView: false
        };
    }

    onLogin() {
        let params = new URLSearchParams();

        params.append('username', this.state.login_username);
        params.append('password', this.state.login_password);

        axios.post(
            'http://localhost:80/login',
            params
        ).then((result) => {
            if ('role' in result.data) {
                localStorage.setItem('role', result.data.role);
            }

            localStorage.setItem('username', result.data.username);
            localStorage.setItem('token', result.data.token);

            this.props.changeLoginStatus1();
            // this.props.refresh();
        }).catch((error) => {
            if ('response' in error) {
                console.log(error.response);

                this.setState({ 'login_message': error.response.data.error });

                this.props.refresh();
            } else {
                console.log(error);
            }
        });
    };

    onRegister() {
        if (this.state.register_email.length === 0 ||
            this.state.register_username.length === 0 ||
            this.state.register_password.length === 0 ||
            this.state.register_first_name.length === 0 ||
            this.state.register_last_name.length === 0) {
            return;
        }

        let params = new URLSearchParams();

        params.append('email', this.state.register_email);
        params.append('username', this.state.register_username);
        params.append('password', this.state.register_password);
        params.append('first_name', this.state.register_first_name);
        params.append('last_name', this.state.register_last_name);

        axios.post(
            'http://localhost:80/register',
            params
        ).then(() => {

            this.setState({
                'register_message': 'Confirmation email sent',
                'register_username': '',
                'register_email': '',
                'register_first_name': '',
                'register_last_name': '',
                'register_password': ''
            });

        }).catch((error) => {

            if ('response' in error) {

                console.log(error.response);
                this.setState({ 'register_message': error.response.data.error });
                // this.props.refresh();
            } else {
                console.log(error);
            }
        });
    };

    onLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
    }

    handleLogin() {

        this.setState({
            loginView: !this.state.loginView,
            registerView: false
        })
    }

    handleRegister() {

        this.setState({
            registerView: !this.state.registerView,
            loginView: false
        })
    }

    render() {
        if (localStorage.getItem('token') !== null) {
            return (
                <nav className={'Account'}>
                    <p>
                        <span className={'Highlight'}>
                            {localStorage.getItem('username')}
                        </span>
                        <a href={''} onClick={this.onLogout} className={'Logout'}>
                            (Log out)
                        </a>
                    </p>
                </nav>
            )
        } else {
            return (
                <nav className={'Account'}>
                    <div className={'Dropdown'}>
                        <button className={'DropdownButton'} onClick={this.handleLogin}>Login</button>
                        {this.state.loginView ?
                            <div className={'DropdownContent'}>
                                <form className={'AccountForm'} onSubmit={this.onLogin}>
                                    <input type={'text'} size={'32'} maxLength={'64'} placeholder={'Username / E-Mail'}
                                        pattern={'.{4,}'} onChange={(event) => {
                                            this.setState({ 'login_username': event.target.value });
                                        }} required />
                                    <input type={'password'} size={'32'} maxLength={'32'} placeholder={'Password'}
                                        pattern={'.{4,}'} onChange={(event) => {
                                            this.setState({ 'login_password': event.target.value });
                                        }} required />
                                    <input className={'Submit'} type={'submit'} value={'Login'} />
                                    <p className={'Message'}>{this.state.login_message}</p>
                                </form>
                            </div> : ''
                        }
                    </div>

                    <div className={'Dropdown'}>
                        <button className={'DropdownButton'} onClick={this.handleRegister}>Register</button>
                        {
                            this.state.registerView ?

                                <div className={'DropdownContent'}>
                                    <form className={'AccountForm'} onSubmit={this.onRegister}>
                                        <input type={'text'} size={'32'} value={this.state.register_email} maxLength={'64'}
                                            placeholder={'E-Mail'} pattern={'[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$'}
                                            onChange={(event) => {
                                                this.setState({ 'register_email': event.target.value });
                                            }} />
                                        <input type={'text'} size={'32'} maxLength={'32'} placeholder={'Username'}
                                            pattern={'.{4,}'} value={this.state.register_username} onChange={(event) => {
                                                this.setState({ 'register_username': event.target.value });
                                            }} />
                                        <input type={'text'} size={'32'} maxLength={'32'} placeholder={'First name'}
                                            value={this.state.register_first_name} onChange={(event) => {
                                                this.setState({ 'register_first_name': event.target.value });
                                            }} />
                                        <input type={'text'} size={'32'} maxLength={'32'} placeholder={'Last name'}
                                            value={this.state.register_last_name} onChange={(event) => {
                                                this.setState({ 'register_last_name': event.target.value });
                                            }} />
                                        <input type={'password'} size={'32'} maxLength={'32'} placeholder={'Password'}
                                            pattern={'.{8,}'} value={this.state.register_password} onChange={(event) => {
                                                this.setState({ 'register_password': event.target.value });
                                            }} />
                                        <input className={'Submit'} type={'submit'} value={'Register'} />
                                        <p className={'Message'}>{this.state.register_message}</p>
                                    </form>
                                </div> : ''
                        }
                    </div>
                </nav>
            );
        }
    }
}

export default Account;