"use client";

import mqtt from "mqtt";

let client = null;
let connectionTime = 0;
const CONNECTION_GRACE_PERIOD = 3000; // 3 seconds grace period after connection

/**
 * Connect to the MQTT broker used by the Arduino / ESP32-C3.
 *
 * @param {Function} onStatusUpdate   - called when bag/status message is received (IDLE, ARMED, CALIBRATED, ONLINE)
 * @param {Function} onTheftDetected  - called when bag/alert THEFT_DETECTED is received
 * @param {Function} [onConnect]      - called when the broker connection is established
 * @param {Function} [onDisconnect]   - called when the broker connection is lost
 */
export function connectMQTT(onStatusUpdate, onTheftDetected, onConnect, onDisconnect) {
  if (client && client.connected) {
    return; // Already connected
  }
  
  if (client) {
    console.log("MQTT client exists but not connected, cleaning up...");
    client.end(true); // Force close
    client = null;
  }

  // HiveMQ WebSocket Broker (same as Arduino)
  const options = {
    reconnectPeriod: 5000, // Reconnect every 5 seconds if disconnected
    connectTimeout: 30000, // 30 second timeout
    keepalive: 60,
    clean: true,
    clientId: 'web_client_' + Math.random().toString(16).substr(2, 8)
  };

  client = mqtt.connect("wss://broker.hivemq.com:8884/mqtt", options);

  client.on("connect", () => {
    connectionTime = Date.now();
    
    // Subscribe to both topics
    client.subscribe("bag/status", (err) => {
      if (err) console.error("Failed to subscribe to bag/status:", err);
    });
    
    client.subscribe("bag/alert", (err) => {
      if (err) console.error("Failed to subscribe to bag/alert:", err);
    });
    
    client.subscribe("bag/command", (err) => {
      if (err) console.error("Failed to subscribe to bag/command:", err);
    });
    
    // Send DISARM on connection to ensure Arduino starts in IDLE state
    setTimeout(() => {
      if (client && client.connected) {
        // Clear any retained alert message first
        client.publish("bag/alert", "", { retain: true, qos: 1 });
        // Then send DISARM command
        client.publish("bag/command", "DISARM", { qos: 1 });
      }
    }, 500); // Small delay to ensure subscriptions are active
    
    if (onConnect) onConnect();
  });

  client.on("message", (topic, message) => {
    const msg = message.toString();

    if (topic === "bag/status") {
      onStatusUpdate(msg);
    } else if (topic === "bag/alert") {
      // Arduino sends: THEFT_DETECTED
      
      // Ignore theft alerts during connection grace period
      const timeSinceConnection = Date.now() - connectionTime;
      if (timeSinceConnection < CONNECTION_GRACE_PERIOD) {
        return;
      }

      if (msg === "THEFT_DETECTED") {
        onTheftDetected();
      }
    }
  });

  client.on("reconnect", () => {
    console.log("Reconnecting to MQTT broker...");
  });

  client.on("offline", () => {
    console.log("MQTT client went offline");
    if (onDisconnect) onDisconnect();
  });

  client.on("close", () => {
    console.log("MQTT connection closed");
    if (onDisconnect) onDisconnect();
  });

  client.on("error", (err) => {
    console.error("MQTT error:", err.message || err);
    // Don't call onDisconnect here - let reconnect handle it
  });
}

/**
 * Publish ARM command to Arduino
 */
export function publishArm() {
  if (client && client.connected) {
    client.publish("bag/command", "ARM", { qos: 1 });
    console.log("ARM command sent to Arduino");
  } else {
    console.error("Cannot send ARM - MQTT client not connected");
  }
}

/**
 * Publish DISARM command to Arduino
 */
export function publishDisarm() {
  if (client && client.connected) {
    client.publish("bag/command", "DISARM", { qos: 1 });
  } else {
    console.error("Cannot send DISARM - MQTT client not connected");
  }
}

export function disconnectMQTT() {
  if (!client) {
    console.log("No MQTT client to disconnect");
    return;
  }
  
  console.log("Disconnecting MQTT client...");
  
  // Send DISARM command before disconnecting to reset Arduino state
  if (client.connected) {
    client.publish("bag/command", "DISARM", { qos: 1 });
    console.log("DISARM command sent before disconnect");
    
    // Small delay to ensure message is sent before closing connection
    setTimeout(() => {
      if (client) {
        client.end();
        client = null;
      }
    }, 200);
  } else {
    client.end();
    client = null;
  }
}