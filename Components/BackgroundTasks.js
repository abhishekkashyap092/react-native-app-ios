import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  ScrollView,
  Button,
  Image
} from 'react-native';

import BackgroundTask from 'react-native-background-task'
import queueFactory from 'react-native-queue';

BackgroundTask.define(async () => {

  // Init queue
  queue = await queueFactory();

  // Register job worker
  queue.addWorker('pre-fetch-image', async (id, payload) => {

    Image.prefetch(payload.imageUrl);

  });

  // Start the queue with a lifespan
  // IMPORTANT: OS background tasks are limited to 30 seconds or less.
  // NOTE: Queue lifespan logic will attempt to stop queue processing 500ms less than passed lifespan for a healthy shutdown buffer.
  // IMPORTANT: Queue processing started with a lifespan will ONLY process jobs that have a defined timeout set.
  // Additionally, lifespan processing will only process next job if job.timeout < (remainingLifespan - 500).
  await queue.start(25000); // Run queue for at most 25 seconds.

  // finish() must be called before OS hits timeout.
  BackgroundTask.finish();

});

export default class BackgroundTasks extends Component<{}> {

  constructor(props) {
    super(props);

    this.state = {
      queue: null,
      showImages: false
    };

    queueFactory()
      .then(queue => {
        this.setState({queue});
      });

  }

  componentDidMount() {
    BackgroundTask.schedule(); // Schedule the task to run every ~15 min if app is closed.
  }

  createPrefetchJobs() {

    // Create the prefetch job for the first <Image> component.
    this.state.queue.createJob(
      'pre-fetch-image',
      { imageUrl: 'https://i.imgur.com/kPkQTic.jpg' }, // Supply the image url we want prefetched in this job to the payload.
      { attempts: 5, timeout: 15000 }, // Retry job on failure up to 5 times. Timeout job in 15 sec (prefetch is probably hanging if it takes that long).
      false // Must pass false as the last param so the queue starts up in the background task instead of immediately.
    );

    // Create the prefetch job for the second <Image> component.
    this.state.queue.createJob(
      'pre-fetch-image',
      { imageUrl: 'https://i.redd.it/uwvjph19mltz.jpg' }, // Supply the image url we want prefetched in this job to the payload.
      { attempts: 5, timeout: 15000 }, // Retry job on failure up to 5 times. Timeout job in 15 sec (prefetch is probably hanging if it takes that long).
      false // Must pass false as the last param so the queue starts up in the background task instead of immediately.
    );

    // Create the prefetch job for the third <Image> component.
    this.state.queue.createJob(
      'pre-fetch-image',
      { imageUrl: 'https://i.redd.it/39w0xd9ersxz.jpg' }, // Supply the image url we want prefetched in this job to the payload.
      { attempts: 5, timeout: 15000 }, // Retry job on failure up to 5 times. Timeout job in 15 sec (prefetch is probably hanging if it takes that long).
      false // Must pass false as the last param so the queue starts up in the background task instead of immediately.
    );

  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <Button title={"Toggle Screen"} onPress={ () => { this.setState({ showImages: !this.state.showImages}) } } />
        {this.state.queue && <Button title={"Pre-fetch Images"} onPress={ this.createPrefetchJobs.bind(this) } />}
        {! this.state.showImages && <Text style={styles.welcome}>Home Screen</Text> }
        {this.state.showImages && <Text style={styles.welcome}>Image Screen</Text> }
        {this.state.showImages && <Image style={styles.image} source={{uri: 'https://i.imgur.com/kPkQTic.jpg'}} permanent={false} /> }
        {this.state.showImages && <Image style={styles.image} source={{uri: 'https://i.redd.it/uwvjph19mltz.jpg'}} permanent={false} /> }
        {this.state.showImages && <Image style={styles.image} source={{uri: 'https://i.redd.it/39w0xd9ersxz.jpg'}} permanent={false} /> }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  image: {
    width:150,
    height: 204
  }
});
