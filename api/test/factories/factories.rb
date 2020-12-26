FactoryBot.define do
  factory :user do
    academic_year { 3 }
    coop_cycle { "4 Years, 2 Co-ops, Spring Cycle" }
    email { "test@test.com" }
    graduation_year { 2022 }
    image_url { "testimage.com/testimage.png" }
    is_advisor { false }
    major { "Computer Science, BSCS" }
    full_name { "Testy Tester" }
    nu_id { "123456789" }

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
      "years": [
          1000,
          1001,
          1002,
          1003
      ],
      "yearMap": {
          "1000": {
              "fall": {
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
                  "year": 1000,
                  "season": "SP",
                  "status": "CLASSES",
                  "termId": 100030,
                  "classes": []
              },
              "summer1": {
                  "year": 1000,
                  "season": "S1",
                  "status": "CLASSES",
                  "termId": 100040,
                  "classes": []
              },
              "summer2": {
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
                  "year": 1001,
                  "season": "FL",
                  "status": "CLASSES",
                  "termId": 100110,
                  "classes": []
              },
              "year": 1001,
              "spring": {
                  "year": 1001,
                  "season": "SP",
                  "status": "COOP",
                  "termId": 100130,
                  "classes": []
              },
              "summer1": {
                  "year": 1001,
                  "season": "S1",
                  "status": "COOP",
                  "termId": 100140,
                  "classes": []
              },
              "summer2": {
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
                  "year": 1002,
                  "season": "FL",
                  "status": "CLASSES",
                  "termId": 100210,
                  "classes": []
              },
              "year": 1002,
              "spring": {
                  "year": 1002,
                  "season": "SP",
                  "status": "COOP",
                  "termId": 100230,
                  "classes": []
              },
              "summer1": {
                  "year": 1002,
                  "season": "S1",
                  "status": "COOP",
                  "termId": 100240,
                  "classes": []
              },
              "summer2": {
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
                  "year": 1003,
                  "season": "FL",
                  "status": "CLASSES",
                  "termId": 100310,
                  "classes": []
              },
              "year": 1003,
              "spring": {
                  "year": 1003,
                  "season": "SP",
                  "status": "CLASSES",
                  "termId": 100330,
                  "classes": []
              },
              "summer1": {
                  "year": 1003,
                  "season": "S1",
                  "status": "INACTIVE",
                  "termId": 100340,
                  "classes": []
              },
              "summer2": {
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

    catalog_year { 2018 }
    coop_cycle { "4 Years, 2 Co-ops, Spring Cycle" }
    sequence :name do |n|
      "Plan #{n}"
    end
    link_sharing_enabled { false }
    schedule { schedule_json }
    major { "Computer Science, BSCS" }
    course_counter { 4 }
    warnings { warnings_json }
    course_warnings { course_warnings_json }
    user factory: :student
  end
end

FactoryBot.define do
    factory :template_plan do
        schedule_json = {
            "years": [
                1000,
                1001,
                1002,
                1003
            ],
            "yearMap": {
                "1000": {
                    "fall": {
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
                        "year": 1000,
                        "season": "SP",
                        "status": "CLASSES",
                        "termId": 100030,
                        "classes": []
                    },
                    "summer1": {
                        "year": 1000,
                        "season": "S1",
                        "status": "CLASSES",
                        "termId": 100040,
                        "classes": []
                    },
                    "summer2": {
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
                        "year": 1001,
                        "season": "FL",
                        "status": "CLASSES",
                        "termId": 100110,
                        "classes": []
                    },
                    "year": 1001,
                    "spring": {
                        "year": 1001,
                        "season": "SP",
                        "status": "COOP",
                        "termId": 100130,
                        "classes": []
                    },
                    "summer1": {
                        "year": 1001,
                        "season": "S1",
                        "status": "COOP",
                        "termId": 100140,
                        "classes": []
                    },
                    "summer2": {
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
                        "year": 1002,
                        "season": "FL",
                        "status": "CLASSES",
                        "termId": 100210,
                        "classes": []
                    },
                    "year": 1002,
                    "spring": {
                        "year": 1002,
                        "season": "SP",
                        "status": "COOP",
                        "termId": 100230,
                        "classes": []
                    },
                    "summer1": {
                        "year": 1002,
                        "season": "S1",
                        "status": "COOP",
                        "termId": 100240,
                        "classes": []
                    },
                    "summer2": {
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
                        "year": 1003,
                        "season": "FL",
                        "status": "CLASSES",
                        "termId": 100310,
                        "classes": []
                    },
                    "year": 1003,
                    "spring": {
                        "year": 1003,
                        "season": "SP",
                        "status": "CLASSES",
                        "termId": 100330,
                        "classes": []
                    },
                    "summer1": {
                        "year": 1003,
                        "season": "S1",
                        "status": "INACTIVE",
                        "termId": 100340,
                        "classes": []
                    },
                    "summer2": {
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

        catalog_year { 2018 }
        coop_cycle { "4 Years, 2 Co-ops, Spring Cycle" }
        sequence :name do |n|
        "Plan #{n}"
        end
        schedule { schedule_json }
        major { "Computer Science, BSCS" }
        folder factory: :folder
    end
end

FactoryBot.define do
  factory :folder do
    name { 'My Folder' }
    user factory: :advisor

    after(:create) do |folder|
        create_list(:template_plan, 3, folder: folder)
        folder.reload
    end
  end
end