import { useEffect, useRef, useState } from 'react'
import styles from './Search.module.scss'
import classNames from 'classnames/bind'
import useDebounce from '~/hooks/useDebounce'
import * as searchServices from '~/services/searchService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons';
import ProductItem from '~/components/Products/ProductItem/ProductItem';

const cx = classNames.bind(styles)

function Search() {
    const [searchValue, setSearchValue] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [showResult, setShowResult] = useState(false)
    const [loading, setLoading] = useState(false)
    const debouncedValue = useDebounce(searchValue, 500)
    const inputRef = useRef()

    useEffect(() => {
        if (!debouncedValue.trim()) {
            setSearchResult([])
            return;
        }

        const fetchApi = async () => {
            setLoading(true)
            try {
                const result = await searchServices.search(debouncedValue)
                setSearchResult(result || [])
                setShowResult(true)
            } catch (error) {
                console.error("Error fetching search results:", error)
                setSearchResult([])
            } finally {
                setLoading(false)
            }
        }
        fetchApi()

    }, [debouncedValue])

    const handleChange = (e) => {
        const searchValue = e.target.value
        if (!searchValue.startsWith(' ')) {
            setSearchValue(searchValue)
        }
    }

    const handleClear = () => {
        setSearchValue('');
        inputRef.current.focus();
        setSearchResult([])
    }

    return (
        <div className={cx('container')}>
            <div className={cx('container_search')}>
                <input
                    type='text'
                    ref={inputRef}
                    value={searchValue}
                    spellCheck={false}
                    placeholder='Nhập từ khóa tìm kiếm...'
                    onChange={handleChange}
                    className={cx('search')}
                />
                {!!searchValue && !loading &&
                    (
                        <button
                            className={cx('clear')}
                            onClick={handleClear}
                        >
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    )
                }
            </div>

            {searchValue && (
                <>
                    <h4 className={cx('length')}>{`${searchResult?.length || 0} sản phẩm với từ khóa "${searchValue}"`}</h4>
                    <div className={cx('result')}>
                        {showResult && loading ? (
                            <div className={cx('loading')}>
                                <FontAwesomeIcon icon={faSpinner}/>
                            </div>
                        ) : (
                            <>
                                {searchResult.map((item, index) => (
                                    <ProductItem key={index} data={item} />
                                ))}
                            </>
                        ) 

                        }
                    </div>
                </>
            )}
        </div>
    );
}

export default Search;