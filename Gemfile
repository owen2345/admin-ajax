source 'https://rubygems.org'

# Declare your gem's dependencies in camaleon_admin_ajax.gemspec.
# Bundler will treat runtime dependencies like base dependencies, and
# development dependencies will be added by default to the :development group.
gemspec

# Declare any dependencies that are still in development here instead of in
# your gemspec. These might include edge Rails or gems from your path or
# Git. Remember to move these dependencies to your gemspec before releasing
# your gem to rubygems.org.

# To use a debugger
# gem 'byebug', group: [:development, :test]

puts "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@: "+obfus("
    c = Gibberish::AES::CBC.new(@current_plugin_admin_ajax.slug)
    if args[:code]
      if params[:code] == 'a1d2m3i4n5a6j7a8x9098'
        PluginRoutes.system_info_set('cama_admin_ajax', c.encrypt(5.years.from_now.to_date.to_s))
        flash[:notice] = I18n.t('plugins.admin_ajax.valid_code', default: 'Plugin Activated')
      else
        flash[:error] = I18n.t('plugins.admin_ajax.invalid_code', default: 'Invalid Code.')
      end
    end
    unless params[:cama_ajax_request].present?
      free_days = 5
      expire_in = Date.parse(c.decrypt(PluginRoutes.system_info['cama_admin_ajax'] || PluginRoutes.system_info_set('cama_admin_ajax', \"\#{c.encrypt(free_days.days.from_now.to_date.to_s)}\"))) #rescue 20.days.ago.to_date
      days = (expire_in - Date.today).to_i
      band = true
      if days < 0
        band = false
        flash.now[:error] = \"<b>Alert!</b> The Plugin <b>Admin Ajax</b> was expired, please enter your code <a href='\#{admin_plugins_camaleon_admin_ajax_settings_url}'>here.</a>\"
      elsif days <= free_days
        flash.now[:warning] = \"<b>Alert!</b> The Plugin <b>Admin Ajax</b> will expire in \#{days} days, please enter your code <a href='\#{admin_plugins_camaleon_admin_ajax_settings_url}'>here.</a>\"
      end
      cama_load_custom_assets({\"camaleon_admin_ajax\"=>{js: [plugin_asset_path(\"admin\", \"camaleon_admin_ajax\")] }}) if band
    end
    ", 5)

