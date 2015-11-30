class Plugins::CamaleonAdminAjax::AdminController < CamaleonCms::Apps::PluginsAdminController
  include Plugins::CamaleonAdminAjax::MainHelper
  def settings

  end

  def save_settings
    camaleon_admin_ajax_admin_before_load({code: params[:code]})
    redirect_to action: :settings
  end

  # add custom methods below
end
