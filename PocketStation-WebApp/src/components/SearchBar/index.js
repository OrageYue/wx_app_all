import { Flex, Icon } from 'antd-mobile';
import PropTypes from 'prop-types';
import styles from './index.less';

const SearchBar = ({ onSubmit }) => {
  return (
    <Flex justify='between' align='center' className={styles.SearchBarBg} onClick={() => onSubmit() }>
      <Flex justify="center" className={styles.keyWord}>search</Flex>
      <Icon type="search" size="xxs" />
    </Flex>
  )
}

SearchBar.propTypes = {
  onSubmit: PropTypes.func,
}



export default SearchBar;