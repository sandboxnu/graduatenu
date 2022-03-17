env_file = File.join(Rails.root, 'config', 'local_env.yml')
YAML.load(File.open(env_file)).each do |key, value|
  if key == "LOCKBOX_KEY"
    Lockbox.master_key = value
  end
end if File.exists?(env_file)
