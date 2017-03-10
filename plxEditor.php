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

		$this->default_lang = $default_lang;

		# droits pour accèder à la page config.php du plugin
		$this->setConfigProfil(PROFIL_ADMIN);

		$this->plugPath = PLX_PLUGINS.__CLASS__.'/';

		# déclaration pour ajouter l'éditeur
		$static = $this->getParam('static')==1 ? '' : '|statique';

		# Déclarations des hooks
		if(!preg_match('/(parametres_edittpl|comment'.$static.')/', basename($_SERVER['SCRIPT_NAME']))) {
			$this->addHook('AdminTopEndHead', 'AdminTopEndHead');
			$this->addHook('AdminFootEndBody', 'AdminFootEndBody');
			$this->addHook('AdminArticlePrepend', 'AdminArticlePrepend'); # conversion des liens pour le preview d'un article
			$this->addHook('plxAdminEditArticle', 'plxAdminEditArticle');
			$this->addHook('AdminArticleTop', 'AdminArticleTop');
			$this->addHook('AdminStaticTop', 'AdminStaticTop');
			$this->addHook('AdminArticlePreview', 'AdminArticlePreview');
			$this->addHook('ThemeEndHead', 'ThemeEndHead');
		}

	}

	#----------

	/**
	 * Méthode qui convertit les liens relatifs en liens absolus
	 *
	 * @return	stdio
	 * @author	Stephane F
	 **/
	public function plxAdminEditArticle() {
		echo '<?php $content["chapo"] = str_replace("../../".$this->aConf["medias"], $this->aConf["medias"], $content["chapo"]); ?>';
		echo '<?php $content["content"] = str_replace("../../".$this->aConf["medias"], $this->aConf["medias"], $content["content"]); ?>';
		echo '<?php $content["chapo"] = str_replace("../../".$this->aConf["racine_plugins"], $this->aConf["racine_plugins"], $content["chapo"]); ?>';
		echo '<?php $content["content"] = str_replace("../../".$this->aConf["racine_plugins"], $this->aConf["racine_plugins"], $content["content"]); ?>';
		echo '<?php $content["chapo"] = str_replace(plxUtils::getRacine(), "", $content["chapo"]); ?>';
		echo '<?php $content["content"] = str_replace(plxUtils::getRacine(), "", $content["content"]); ?>';
	}
	/**
	 * Méthode qui convertit les liens relatifs en liens absolus
	 *
	 * @return	stdio
	 * @author	Stephane F
	 **/
	public function AdminArticlePreview() {
		echo '<?php $art["chapo"] = str_replace("../../".$plxAdmin->aConf["medias"], $plxAdmin->aConf["medias"], $art["chapo"]); ?>';
		echo '<?php $art["content"] = str_replace("../../".$plxAdmin->aConf["medias"], $plxAdmin->aConf["medias"], $art["content"]); ?>';
		echo '<?php $art["chapo"] = str_replace("../../".$plxAdmin->aConf["racine_plugins"], $plxAdmin->aConf["racine_plugins"], $art["chapo"]); ?>';
		echo '<?php $art["content"] = str_replace("../../".$plxAdmin->aConf["racine_plugins"], $plxAdmin->aConf["racine_plugins"], $art["content"]); ?>';
		echo '<?php $art["chapo"] = str_replace(plxUtils::getRacine(), "", $art["chapo"]); ?>';
		echo '<?php $art["content"] = str_replace(plxUtils::getRacine(), "", $art["content"]); ?>';
	}

	/**
	 * Méthode qui convertit les liens absolus en liens relatifs dans les articles
	 *
	 * @return	stdio
	 * @author	Stephane F
	 **/
	public function AdminArticleTop() {
		echo '<?php $chapo = str_replace($plxAdmin->aConf["racine_plugins"], "../../".$plxAdmin->aConf["racine_plugins"], $chapo); ?>';
		echo '<?php $content = str_replace($plxAdmin->aConf["racine_plugins"], "../../".$plxAdmin->aConf["racine_plugins"], $content); ?>';
		echo '<?php $chapo = str_replace($plxAdmin->aConf["medias"], "../../".$plxAdmin->aConf["medias"], $chapo); ?>';
		echo '<?php $content = str_replace($plxAdmin->aConf["medias"], "../../".$plxAdmin->aConf["medias"], $content); ?>';
	}

	/**
	 * Méthode qui convertit les liens absolus en liens relatifs dans les pages static
	 *
	 * @return	stdio
	 * @author	Stephane F
	 **/
	public function AdminStaticTop() {
		echo '<?php $content = str_replace($plxAdmin->aConf["racine_plugins"], "../../".$plxAdmin->aConf["racine_plugins"], $content); ?>';
		echo '<?php $content = str_replace($plxAdmin->aConf["medias"], "../../".$plxAdmin->aConf["medias"], $content); ?>';
	}

	#----------

	/**
	 * Méthode du hook AdminTopEndHead
	 *
	 * @return	stdio
	 * @author	Stephane F
	 **/
	public function AdminTopEndHead() {
		echo '<?php $plxAdmin->aConf["default_lang"] ?>';
		echo '<link rel="stylesheet" type="text/css" href="'.$this->plugPath.'plxEditor/css/plxEditor.css" media="screen" />'."\n";
		echo '<link rel="stylesheet" type="text/css" href="'.$this->plugPath.'plxEditor/css/viewsource.css" media="screen" />'."\n";
		echo '<?php
			$js = "'.$this->plugPath.'plxEditor/lang/".$plxAdmin->aConf["default_lang"].".js";
			if(!is_file($js)) $js = "'.$this->plugPath.'plxEditor/lang/fr.js";
			echo "<script src=\"".$js."\"></script>\n";
		?>';
		echo '<?php $medias = $plxAdmin->aConf["medias"].($plxAdmin->aConf["userfolders"] ? $_SESSION["user"]."/" : ""); ?>';
		echo '<script src="'.PLX_PLUGINS.'plxEditor/plxEditor/plxEditor.js"></script>'."\n";
	}

	/**
	 * Méthode du hook AdminFootEndBody
	 *
	 * @return	stdio
	 * @author	Stephane F
	 **/
	public function AdminFootEndBody() {
		echo '
		<script>
			PLUXML_ROOT = "<?php echo $plxAdmin->racine ?>";
			PLXEDITOR_PATH_MEDIAS = "<?php echo $medias ?>";
			PLXEDITOR_PATH_PLUGINS = "<?php echo $plxAdmin->aConf["racine_plugins"] ?>";
			if(document.getElementById("id_chapo")) { editor_chapo = new PLXEDITOR.editor.create("editor_chapo", "id_chapo"); }
			if(document.getElementById("id_content")) { editor_content = new PLXEDITOR.editor.create("editor_content", "id_content"); }
		</script>
		';
	}

	/**
	 * Méthode du hook ThemeEndHead
	 *
	 * @return	stdio
	 * @author	Stephane F
	 **/
	public function ThemeEndHead() {
		echo '<style>.frame.youtube iframe { border:0; max-width: 560px; max-height: 315px; }</style>'."\n";
	}

}
?>
