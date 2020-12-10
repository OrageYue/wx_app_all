import { Flex, Icon } from 'antd-mobile';
import styles from './index.less';

function GratsCard({ gratsTree, loading_tree, loading_star, gratStar, onGrat }) {
  let staff = gratStar&&gratStar.staff;
  // gratsTree.splice(0,1);
  return (
    <Flex className={styles.card} direction="column">
      <Flex className={styles.cardT}>
        <Flex className={styles.treeWrap} justify="center"><img src="/tree.png" alt="/tree.png"/></Flex>
        <Flex direction="column" justify="start" align="between" className={styles.cardR}>
          <span className={styles.grats_title}>感恩之星</span>
          {loading_star?<Icon type="loading" size='md' />:<div className={styles.grats_name}>{staff&&staff.name}</div>}
          <Flex justify="around" className={styles.tree}>
            {
              loading_tree?<Icon type="loading" size='md' />:
              gratsTree&&gratsTree.map( (ge, inx) => (<Flex direction="column" justify="center" align="center" onClick={ge.treeCardClick} className={styles.treeCard} key={inx} >
                <span style={{width: '13px', wordWrap: 'break-word'}}>{ge.gt&&ge.gt.staff.name}</span>
              </Flex>))
            }
          </Flex>
        </Flex>
      </Flex>
      <Flex className={styles.Wgrans} onClick={onGrat} >
        <img src="/grans_letter.png" alt="/grans_letter.png" />
        <span>写感恩信</span>
      </Flex>
    </Flex>
  )
}

export default GratsCard;