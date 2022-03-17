class FoldersController < ApplicationController
    before_action :set_user

    # creates a new folder by name
    def create
        if authorized
            params_copy = folder_params.clone()

            if @folder = Folder.create!({
                user_id: params[:user_id],
                name: params_copy[:name]
            })
                render :show
            else
                render json: {error: "Unable to store Folder."}, status: :unprocessable_entity
            end
        else
            render json: {error: "Unauthorized."}, status: :unprocessable_entity
        end
    end

    # shows a single folder
    def show
        if authorized
            @folder = Folder.find_by(id: params[:id])
            if @folder
                render :show
            else
                render json: {error: "No such folder."}, status: :unprocessable_entity
             end
        else
            render json: {error: "Unauthorized."}, status: :unprocessable_entity
        end
    end

    def folder_params
        params.require(:folder).permit(:name)
    end

    #sets the current user
    def set_user
        if signed_in?
            @user = User.find_by_id(@current_user_id)
            if @user == nil
                render json: {error: "User not found."}, status: 404
            end
        else
            render json: {error: "Unauthorized."}, status: :unprocessable_entity
        end
    end

    def authorized
        @user.is_advisor
    end
end
