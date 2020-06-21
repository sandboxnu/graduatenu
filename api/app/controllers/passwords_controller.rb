class PasswordsController < Devise::PasswordsController
    def update
        user = current_user
        old_password = password_params[:old_password]
        new_password = password_params[:new_password]
        confirm_password = password_params[:confirm_password]

        if old_password and new_password and confirm_password
            if user.valid_password?(old_password)
                if user.reset_password(new_password, confirm_password)
                    render json: { success: "Successfully updated password" }, status: :ok
                else
                    render json: { error: "Passwords must match" }, status: :unprocessable_entity
                end
            else
                render json: { error: "Unauthorized" }, status: :unprocessable_entity
            end
        else
            render json: { error: "Provide: old_password, new_password, confirm_password" }, status: :unprocessable_entity
        end
    end

    private

    def password_params
        params.require(:user).permit(:old_password, :new_password, :confirm_password)
    end  
end