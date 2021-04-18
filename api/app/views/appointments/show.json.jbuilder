json.appointment do |json|
  json.partial! 'appointments/appointment', appointment: @appointment
end
