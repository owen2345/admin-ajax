module ActionController
  module Redirecting
    old_method = instance_method(:redirect_to)
    define_method(:redirect_to) { |*args|
      begin
        args[0][:cama_ajax_request] = "redirect" if params.present? && params[:cama_ajax_request].present? # this line is the customization to repeat this value after redirect
      rescue
      end
      old_method.bind(self).call(*args)
    }
  end
end
