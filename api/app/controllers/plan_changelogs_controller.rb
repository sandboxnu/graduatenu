class PlanChangelogsController < ApplicationController
    before_action :set_plan
    before_action :set_author, only: [:create]
    before_action :set_plan_changelog, only: [:show]

    def index
        if @plan
            @plan_changelogs = @plan.plan_changelogs.order(:created_at)
        else 
            render json: {error: "No such plan."}, status: :unprocessable_entity
        end
    end

    def show
        if @plan_changelog
            render :show
        else
            render json: {error: "No such plan changelog."}, status: :unprocessable_entity
        end
    end

    def create
        if @plan_changelog = PlanChangelog.create(plan_id: params[:plan_id], author: @author.full_name, author_id: plan_changelog_params[:author_id], log: plan_changelog_params[:log])
            render :show
        else
            render json: {error: "Unable to store plan changelog."}, status: :unprocessable_entity
        end
    end

    def set_plan
        @plan = Plan.find_by_id(params[:plan_id])
    end

    def set_author
        @author = User.find_by_id(plan_changelog_params[:author_id])
    end

    def set_plan_changelog
        @plan_changelog = PlanChangelog.find_by_id(params[:id])
    end

    def plan_changelog_params
        params.require(:plan_changelog).permit(:log, :author_id)
    end
end

