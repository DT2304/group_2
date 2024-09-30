import React, { useEffect } from 'react';
import styles from './Notification.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function Notification({ show, message, onClose }) {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    return (
        <div className={cx('wrapper', { show })}>
            <div className={cx('toast', {
                'success': message.typeMess === true,
                'error': message.typeMess === false,    
            })}>
                <div className={cx('container-2')}>
                    <p>{message.title}</p>
                    <p>{message.body}</p>
                </div>
            </div>
        </div>
    );
}

export default Notification;
