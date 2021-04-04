json.array! @appointments do |appointment|
  json.partial! 'appointments/appointment', appointment: appointment
end
