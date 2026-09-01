def test_get_pulsars(client, seed_pulsars):
    response = client.get("/pulsars")
    assert response.status_code == 200
    assert len(response.json()) == 3

def test_filter_by_classification(client, seed_pulsars):
    response = client.post("/pulsars/filter", json={
        "conditions" : [
        {"field": "classification","operator": "=", "value": "Magnetars"}
        ],
        "combinator" : "AND"
    })
    assert len(response.json()) == 1
    assert response.json()[0]["classification"] == "Magnetars"
    assert response.status_code == 200

def test_filter_by_p0(client, seed_pulsars):
    response = client.post("/pulsars/filter", json={
        "conditions": [
            {"field" : "P0", "operator": ">", "value": 1}
        ],
        "combinator": "AND"
    })
    assert  response.status_code ==200
    assert len(response.json()) ==2

def test_filter_empty_conditions(client, seed_pulsars):
    response = client.post("/pulsars/filter", json={
        "conditions": [],
        "combinator": "AND"
    })
    assert response.status_code ==200
    assert len(response.json()) ==3

def test_filter_invalid_operator_pairing(client):
    response = client.post("/pulsars/filter", json={
        "conditions": [
            {"field": "TYPE", "operator": ">", "Value": "foo"}
        ],
        "combinator" : "AND"
    })
    assert response.status_code == 422