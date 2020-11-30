FactoryBot.define do
  factory :user do
    academic_year { 3 }
    coop_cycle { "4 Years, 2 Co-ops, Spring Cycle" }
    email { "test@test.com" }
    encrypted_password { "password123" }
    graduation_year { 2022 }
    image_url { "testimage.com/testimage.png" }
    is_advisor { false }
    major { "Computer Science, BSCS" }
    username { "Testy Tester" }

    factory :advisor do
      is_advisor { true }
    end

    factory :student do
      is_advisor { false }
    end
  end
end

FactoryBot.define do
  factory :plan do
    warnings_json = [
      {
          "message": "Currently enrolled in 2 credits(s). May be under-enrolled. Minimum credits for this term 12.",
          "termId": 100010
      }
    ].to_json
    course_warnings_json = [
      {
          "message": "CS1210: prereqs not satisfied: AND: CS2510",
          "termId": 100010,
          "subject": "CS",
          "classId": 1210
      }
    ].to_json
    schedule_json = {
      "id": "0",
      "years": [
          1000,
          1001,
          1002,
          1003
      ],
      "yearMap": {
          "1000": {
              "fall": {
                  "id": 1010,
                  "year": 1000,
                  "season": "FL",
                  "status": "CLASSES",
                  "termId": 100010,
                  "classes": [
                      {
                          "name": "First Year Seminar",
                          "subject": "CS",
                          "classId": 1200,
                          "prereqs": {
                              "type": "and",
                              "values": []
                          },
                          "coreqs": {
                              "type": "and",
                              "values": []
                          },
                          "numCreditsMax": 1,
                          "numCreditsMin": 1,
                          "dndId": "CS 1200 1"
                      },
                      {
                          "name": "Professional Development for Khoury Co-op",
                          "subject": "CS",
                          "classId": 1210,
                          "prereqs": {
                              "type": "and",
                              "values": [
                                  {
                                      "classId": "2510",
                                      "subject": "CS"
                                  }
                              ]
                          },
                          "coreqs": {
                              "type": "and",
                              "values": []
                          },
                          "numCreditsMax": 1,
                          "numCreditsMin": 1,
                          "dndId": "CS 1210 2"
                      }
                  ]
              },
              "year": 1000,
              "spring": {
                  "id": 1030,
                  "year": 1000,
                  "season": "SP",
                  "status": "CLASSES",
                  "termId": 100030,
                  "classes": []
              },
              "summer1": {
                  "id": 1040,
                  "year": 1000,
                  "season": "S1",
                  "status": "CLASSES",
                  "termId": 100040,
                  "classes": []
              },
              "summer2": {
                  "id": 1060,
                  "year": 1000,
                  "season": "S2",
                  "status": "CLASSES",
                  "termId": 100060,
                  "classes": []
              },
              "isSummerFull": false
          },
          "1001": {
              "fall": {
                  "id": 1011,
                  "year": 1001,
                  "season": "FL",
                  "status": "CLASSES",
                  "termId": 100110,
                  "classes": []
              },
              "year": 1001,
              "spring": {
                  "id": 1031,
                  "year": 1001,
                  "season": "SP",
                  "status": "COOP",
                  "termId": 100130,
                  "classes": []
              },
              "summer1": {
                  "id": 1041,
                  "year": 1001,
                  "season": "S1",
                  "status": "COOP",
                  "termId": 100140,
                  "classes": []
              },
              "summer2": {
                  "id": 1061,
                  "year": 1001,
                  "season": "S2",
                  "status": "CLASSES",
                  "termId": 100160,
                  "classes": []
              },
              "isSummerFull": false
          },
          "1002": {
              "fall": {
                  "id": 1012,
                  "year": 1002,
                  "season": "FL",
                  "status": "CLASSES",
                  "termId": 100210,
                  "classes": []
              },
              "year": 1002,
              "spring": {
                  "id": 1032,
                  "year": 1002,
                  "season": "SP",
                  "status": "COOP",
                  "termId": 100230,
                  "classes": []
              },
              "summer1": {
                  "id": 1042,
                  "year": 1002,
                  "season": "S1",
                  "status": "COOP",
                  "termId": 100240,
                  "classes": []
              },
              "summer2": {
                  "id": 1062,
                  "year": 1002,
                  "season": "S2",
                  "status": "CLASSES",
                  "termId": 100260,
                  "classes": []
              },
              "isSummerFull": false
          },
          "1003": {
              "fall": {
                  "id": 1013,
                  "year": 1003,
                  "season": "FL",
                  "status": "CLASSES",
                  "termId": 100310,
                  "classes": []
              },
              "year": 1003,
              "spring": {
                  "id": 1033,
                  "year": 1003,
                  "season": "SP",
                  "status": "CLASSES",
                  "termId": 100330,
                  "classes": []
              },
              "summer1": {
                  "id": 1043,
                  "year": 1003,
                  "season": "S1",
                  "status": "INACTIVE",
                  "termId": 100340,
                  "classes": []
              },
              "summer2": {
                  "id": 1063,
                  "year": 1003,
                  "season": "S2",
                  "status": "INACTIVE",
                  "termId": 100360,
                  "classes": []
              },
              "isSummerFull": false
          }
      }
    }.to_json

    coop_cycle { "4 Years, 2 Co-ops, Spring Cycle" }
    name { "Plan 1" }
    link_sharing_enabled { false }
    schedule { schedule_json }
    major { "Computer Science, BSCS" }
    course_counter { 4 }
    warnings { warnings_json }
    course_warnings { course_warnings_json }
    user factory: :student
  end
end