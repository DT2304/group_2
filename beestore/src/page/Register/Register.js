import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PostRegister } from '~/services/RegisterService'
import styles from './Register.module.scss'
import classNames from 'classnames/bind'
import config from '~/config'
import '~/components/GlobalStyle/GlobalStyle.module.scss'
import Notification from '~/components/Notification/Notification'

const cx = classNames.bind(styles)

function Register() {

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rePassword, setRePassword] = useState('')
    // const [message, setMessage] = useState('')
    const [showNotification, setShowNotification] = useState(false); // Trạng thái hiển thị thông báo
    const [message, setMessage] = useState({ title: '', body: '', typeMess: null }); // Nội dung thông báo
    const navigate = useNavigate()

    const handleRegister = async (e) => {
        e.preventDefault();

        // Kiểm tra xem mật khẩu nhập lại có khớp không
        if (password !== rePassword) {
            setMessage('Mật khẩu không khớp.');
            return;
        }

        try {
            const data = await PostRegister(username, email, password);            
            if (data.message) {
                setMessage({
                    title: 'Thành công!',
                    body: 'đăng ký thành công!',
                    typeMess: true,
                });
                setShowNotification(true);
                navigate('/login');
            } else {
                setMessage({
                    title: 'Thất bại!',
                    body: 'Đăng ký thất bại',
                    typeMess: false,
                });
                setShowNotification(true);
            }
        } catch (error) {
            setMessage({
                title: 'Thất bại!',
                body: error.response?.data?.message || 'An error occurred during registration.',
                typeMess: false,
            });
            setShowNotification(true);

        }
    };
    const handleCloseNotification = () => {
        setShowNotification(false); // Đóng thông báo
    };
    return (
        <div className={cx('wrapper')}>
            <Notification show={showNotification} message={message} onClose={handleCloseNotification} />
            <div className={cx('register')}>
                <h1>TẠO TÀI KHOẢN</h1>
            </div>
            <div className={cx('form')}>
                <form onSubmit={handleRegister}>
                    <input
                        className={cx(' email')}
                        type='email'
                        placeholder='Email'
                        value={email}
                        onChange={(e) => { setEmail(e.target.value) }}
                    />
                    <input
                        className={cx(' user')}
                        type='text'
                        placeholder='Username'
                        value={username}
                        onChange={(e) => { setUsername(e.target.value) }}
                    />
                    <input
                        className={cx(' password')}
                        type='password'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => { setPassword(e.target.value) }}
                    />
                    <input
                        className={cx(' password')}
                        type='password'
                        placeholder='Repassword'
                        value={rePassword}
                        onChange={(e) => { setRePassword(e.target.value) }}
                    />
                    <button
                        className={cx('submit')}
                        type='submit'
                    >ĐĂNG KÝ</button>
                    <Link to={config.routes.login}><p >Đã có tài khoản</p></Link>
                </form>
            </div>
        </div>
    );
}

export default Register;