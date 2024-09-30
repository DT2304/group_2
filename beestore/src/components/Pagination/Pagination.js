import React from 'react';
import classNames from 'classnames/bind';
import styles from './Pagination.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Pagination({ productsPerPage, totalProducts, paginate, currentPage }) {
    const pageNumbers = [];
    const totalPages = Math.ceil(totalProducts / productsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    const goToPreviousPage = () => {
        if (currentPage === 1) {
            paginate(totalPages);
        } else {
            paginate(currentPage - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage === totalPages) {
            paginate(1);
        } else {
            paginate(currentPage + 1);
        }
    };

    return (
        <nav className={cx('pagination-container')}>
            <button className={cx('nav-button')} onClick={goToPreviousPage}>
                <FontAwesomeIcon icon={faAngleLeft} />
            </button>
            <ul className={cx('pagination')}>
                {pageNumbers.map(number => (
                    <li key={number} className={cx('page-item')}>
                        <button 
                            onClick={() => paginate(number)} 
                            className={cx('page-link', { active: number === currentPage })}
                        >
                            {number}
                        </button>
                    </li>
                ))}
            </ul>
            <button className={cx('nav-button')} onClick={goToNextPage}>
                <FontAwesomeIcon icon={faAngleRight} />
            </button>
        </nav>
    );
}

export default Pagination;