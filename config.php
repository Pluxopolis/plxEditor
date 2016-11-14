<?php if(!defined('PLX_ROOT')) exit; ?>
<?php

# Control du token du formulaire
plxToken::validateFormToken($_POST);

if(!empty($_POST)) {
	$plxPlugin->setParam('static', $_POST['static'], 'numeric');
	$plxPlugin->saveParams();
	header('Location: parametres_plugin.php?p=plxEditor');
	exit;
}
?>
<style>
form.inline-form label {
	width: 300px ;
}
</style>
<form class="inline-form" id="form_plxEditor" action="parametres_plugin.php?p=plxEditor" method="post">
	<fieldset>
		<p>
			<label for="id_static"><?php echo $plxPlugin->lang('L_STATIC') ?>&nbsp;:</label>
			<?php plxUtils::printSelect('static',array('1'=>L_YES,'0'=>L_NO), $plxPlugin->getParam('static'));?>
		</p>
		<p class="in-action-bar">
			<?php echo plxToken::getTokenPostMethod() ?>
			<input type="submit" name="submit" value="<?php $plxPlugin->lang('L_SAVE') ?>" />
		</p>
	</fieldset>
</form>