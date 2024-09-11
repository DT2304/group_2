import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { postLogIn } from '~/services/LoginService'
import styles from './login.module.scss'
import classNames from 'classnames/bind'
import { Link } from 'react-router-dom';
import config from '~/components/config';
const cx = classNames.bind(styles)

function LogIn() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const navigate = useNavigate()


    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const data = await postLogIn(username, password)
            if (data.message) {
                setMessage(data)
                localStorage.setItem('user', JSON.stringify(data));
                navigate('/')
            } else {
                setMessage('Login failed. Please check your credentials.')
            }
        } catch {
            setMessage('An error occurred while logging in.')
        }

    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('login')}>
                <h1>ĐĂNG NHẬP </h1>

            </div>
            <div className={cx('form')}>
                <form onSubmit={handleLogin}>
                    <input
                        type='text'
                        placeholder='Username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={cx('input user')}
                    />
                    <div >
                        <input
                            type='password'
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={cx('input password')}
                        />

                    </div>
                    <button
                        type='submit'
                        className={cx('btn-login')}
                    >
                        ĐĂNG NHẬP
                    </button> 
                    {message && alert(message)}
                    <p className={cx('forgot')}>Quên mật khẩu?</p>
                    <Link to={config.routes.register}><button className={cx('btn-register')}> ĐĂNG KÍ </button></Link>
                </form>
            </div>
        </div>
    );
}

export default LogIn;