<?php
/**
 * Plugin plxEditor
 *
 * @package	PLX
 * @author	Stephane F
 **/
class plxEditor extends plxPlugin {

	/**
	 * Constructeur de la classe
	 *
	 * @param	default_lang	langue par défaut utilisée par PluXml
	 * @return	null
	 * @author	Stephane F
	 **/
	public function __construct($default_lang) {

		# Appel du constructeur de la classe plxPlugin (obligatoire)
		parent::__construct($default_lang);

		# droits pour accèder à la page config.php du plugin
		$this->setConfigProfil(PROFIL_ADMIN);
		
		$this->plugPath = PLX_PLUGINS.__CLASS__.'/';

		# Déclarations des hooks
		if(!preg_match('/(parametres_edittpl|comment)/', basename($_SERVER['SCRIPT_NAME']))) {
			$this->addHook('AdminTopEndHead', 'AdminTopEndHead');
			$this->addHook('AdminFootEndBody', 'AdminFootEndBody');
			$this->addHook('AdminArticlePrepend', 'AdminArticlePrepend'); # conversion des liens pour le preview d'un article

			$this->addHook('plxAdminEditArticle', 'plxAdminEditArticle');
			$this->addHook('AdminArticleTop', 'AdminArticleTop');
			$this->addHook('AdminArticlePreview', 'AdminArticlePreview');
		}

	}

	#----------

	/**
	 * Méthode qui convertit les liens absolus en liens relatifs
	 *
	 * @return	stdio
	 * @author	Stephane F
	 **/
	public function plxAdminEditArticle() {
		echo "<?php \$content['chapo'] = str_replace(plxUtils::getRacine(), '', \$content['chapo']); ?>";
		echo "<?php \$content['content'] = str_replace(plxUtils::getRacine(), '', \$content['content']); ?>";
	}
	/**
	 * Méthode qui convertit les liens absolus en liens relatifs
	 *
	 * @return	stdio
	 * @author	Stephane F
	 **/
	public function AdminArticlePreview() {
		echo "<?php \$art['chapo'] = str_replace(plxUtils::getRacine(), '', \$art['chapo']); ?>";
		echo "<?php \$art['content'] = str_replace(plxUtils::getRacine(), '', \$art['content']); ?>";
	}

	/**
	 * Méthode qui convertit les liens relatifs en liens absolus
	 *
	 * @return	stdio
	 * @author	Stephane F
	 **/
	public function AdminArticleTop() {
		echo "<?php \$chapo = str_replace('../../'.\$plxAdmin->aConf['medias'], plxUtils::getRacine().\$plxAdmin->aConf['medias'], \$chapo); ?>";
		echo "<?php \$content = str_replace('../../'.\$plxAdmin->aConf['medias'], plxUtils::getRacine().\$plxAdmin->aConf['medias'], \$content); ?>";
	}

	/**
	 * Méthode appelée lors du préview d'un article
	 *
	 * @return	stdio
	 * @author	Stephane F
	 **/
	public function AdminArticlePrepend() {
		if(!empty($_POST['preview'])) {
			echo "<?php \$_POST['chapo'] = str_replace('../../'.\$plxAdmin->aConf['medias'], \$plxAdmin->aConf['medias'], \$_POST['chapo']); ?>";
			echo "<?php \$_POST['content'] = str_replace('../../'.\$plxAdmin->aConf['medias'], \$plxAdmin->aConf['medias'], \$_POST['content']); ?>";
		}
	}

	#----------

	/**
	 * Méthode du hook AdminTopEndHead
	 *
	 * @return	stdio
	 * @author	Stephane F
	 **/
	public function AdminTopEndHead() {
		echo '<link type="text/css" rel="stylesheet" href="'.$this->plugPath.'plxEditor/css/plxEditor.css" />'."\n";
		echo '<script type="text/javascript" src="'.$this->plugPath.'plxEditor/plxEditor.js"></script>'."\n";
	}

	/**
	 * Méthode du hook AdminFootEndBody
	 *
	 * @return	stdio
	 * @author	Stephane F
	 **/
	public function AdminFootEndBody() {?>

<script type="text/javascript">
<!--
var options = null;
var ed_chapo = new PLXEDITOR.editor.create('id_chapo', options);
var ed_content = new PLXEDITOR.editor.create('id_content', options);
-->
</script>

	<?php
	}
}
?>