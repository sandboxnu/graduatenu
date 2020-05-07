FROM ruby:2.7.0
#may not need nodejs
RUN apt-get update -qq && apt-get install -y nodejs postgresql-client
RUN mkdir /api
WORKDIR /api
COPY Gemfile /api/Gemfile
COPY Gemfile.lock /api/Gemfile.lock
RUN bundle install
COPY . /api

# Add a script to be executed every time the container starts.
COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]
#change to port 80
EXPOSE 80

# Start the main process.
CMD ["rails", "server", "-b", "0.0.0.0"]